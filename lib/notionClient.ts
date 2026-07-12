import type { UserData, NotionConfig, NoticeData, NoticeType } from "./types";

// Internal helper: all Notion calls go through our server-side API route
async function callNotion<T = unknown>(
  apiKey: string,
  endpoint: string,
  method: string,
  payload?: unknown
): Promise<T> {
  const res = await fetch("/api/notion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, endpoint, method, payload }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Notion API 오류");
  }
  return data as T;
}

// ── Connection Test ─────────────────────────────────────────────────────────
export async function testNotionConnection(
  config: NotionConfig
): Promise<{ ok: boolean; title?: string; error?: string }> {
  try {
    const data = await callNotion<{ title?: Array<{ plain_text: string }>; object?: string }>(
      config.apiKey,
      `databases/${config.dbId}`,
      "GET"
    );
    const title = data.title?.[0]?.plain_text ?? "(제목 없음)";
    return { ok: true, title };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "알 수 없는 오류" };
  }
}

// ── Query all rows ──────────────────────────────────────────────────────────
interface NotionQueryResult {
  results: NotionPage[];
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

type NotionProperty =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
  | { type: "multi_select"; multi_select: Array<{ name: string }> }
  | Record<string, unknown>;

function getText(prop: NotionProperty | undefined): string {
  if (!prop) return "";
  if ("title" in prop && Array.isArray(prop.title)) return prop.title[0]?.plain_text ?? "";
  if ("rich_text" in prop && Array.isArray(prop.rich_text)) return prop.rich_text[0]?.plain_text ?? "";
  return "";
}

function getMultiSelect(prop: NotionProperty | undefined): string[] {
  if (!prop) return [];
  if ("multi_select" in prop && Array.isArray(prop.multi_select))
    return prop.multi_select.map((x) => x.name);
  return [];
}

export async function fetchUsersFromNotion(config: NotionConfig): Promise<UserData[]> {
  const data = await callNotion<NotionQueryResult>(
    config.apiKey,
    `databases/${config.dbId}/query`,
    "POST",
    {}
  );

  return data.results
    .map((page) => {
      const props = page.properties;
      const idProp = props["사번"] ?? props["ID"];
      const nameProp = props["이름"] ?? props["Name"];
      const attProp = props["출석일"];

      return {
        pageId: page.id,
        id: getText(idProp),
        name: getText(nameProp),
        attendance: getMultiSelect(attProp),
      };
    })
    .filter((u) => u.id !== "" && u.name !== "");
}

// ── Create a new user page ──────────────────────────────────────────────────
export async function createUserInNotion(
  config: NotionConfig,
  id: string,
  name: string
): Promise<string> {
  const data = await callNotion<{ id: string }>(
    config.apiKey,
    "pages",
    "POST",
    {
      parent: { database_id: config.dbId },
      properties: {
        사번: { title: [{ text: { content: id } }] },
        이름: { rich_text: [{ text: { content: name } }] },
        출석일: { multi_select: [] },
      },
    }
  );
  return data.id;
}

// ── Update attendance for a page ────────────────────────────────────────────
export async function updateAttendanceInNotion(
  config: NotionConfig,
  pageId: string,
  attendance: string[]
): Promise<void> {
  await callNotion(config.apiKey, `pages/${pageId}`, "PATCH", {
    properties: {
      출석일: { multi_select: attendance.map((a) => ({ name: a })) },
    },
  });
}

// ── Archive (delete) a page ─────────────────────────────────────────────────
export async function archivePageInNotion(
  config: NotionConfig,
  pageId: string
): Promise<void> {
  await callNotion(config.apiKey, `pages/${pageId}`, "PATCH", { archived: true });
}

// ════════════════════════════════════════════════════════════════════════════
// Notice Board (알림장) — uses NEXT_PUBLIC_NOTION_NOTICE_DB_ID
// ════════════════════════════════════════════════════════════════════════════

const CATEGORY_MAP: Record<string, NoticeType> = {
  공지사항: "notice",
  과제: "homework",
  공유사항: "share",
};

const CATEGORY_LABEL: Record<NoticeType, string> = {
  notice: "공지사항",
  homework: "과제",
  share: "공유사항",
};

function getNoticeDbId(): string {
  const dbId = process.env.NEXT_PUBLIC_NOTION_NOTICE_DB_ID ?? "";
  if (!dbId) throw new Error("NEXT_PUBLIC_NOTION_NOTICE_DB_ID 환경변수가 설정되지 않았습니다.");
  return dbId;
}

export async function fetchNoticesFromNotion(apiKey: string): Promise<NoticeData[]> {
  const dbId = getNoticeDbId();
  const data = await callNotion<NotionQueryResult>(apiKey, `databases/${dbId}/query`, "POST", {
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return data.results.map((page) => {
    const props = page.properties;
    const content = getText(props["내용"]);
    const author = getText(props["작성자"]);
    const createdAt = getText(props["작성일"]);
    const categoryLabel = (() => {
      const p = props["카테고리"];
      if (p && "select" in p && p.select && typeof p.select === "object" && "name" in (p.select as object)) {
        return (p.select as { name: string }).name;
      }
      return "공지사항";
    })();
    const type: NoticeType = CATEGORY_MAP[categoryLabel] ?? "notice";
    return { id: page.id, type, author, content, createdAt };
  }).filter((n) => n.content !== "");
}

export async function createNoticeInNotion(
  apiKey: string,
  notice: Omit<NoticeData, "id">
): Promise<string> {
  const dbId = getNoticeDbId();
  const title = notice.content.slice(0, 30) + (notice.content.length > 30 ? "..." : "");
  const data = await callNotion<{ id: string }>(apiKey, "pages", "POST", {
    parent: { database_id: dbId },
    properties: {
      제목: { title: [{ text: { content: title } }] },
      내용: { rich_text: [{ text: { content: notice.content } }] },
      카테고리: { select: { name: CATEGORY_LABEL[notice.type] } },
      작성자: { rich_text: [{ text: { content: notice.author } }] },
      작성일: { rich_text: [{ text: { content: notice.createdAt } }] },
    },
  });
  return data.id;
}

export async function deleteNoticeInNotion(apiKey: string, pageId: string): Promise<void> {
  await callNotion(apiKey, `pages/${pageId}`, "PATCH", { archived: true });
}
