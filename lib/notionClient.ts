import type { UserData, NotionConfig } from "./types";

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
