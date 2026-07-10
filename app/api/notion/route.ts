import { NextRequest, NextResponse } from "next/server";

const NOTION_VERSION = "2022-06-28";

// Generic proxy: forwards method, headers (with injected auth), body to Notion API
// Body shape: { apiKey, endpoint, method, payload? }
// endpoint examples:
//   "databases/{dbId}/query"
//   "pages"
//   "pages/{pageId}"

export async function POST(req: NextRequest) {
  try {
    const { apiKey, endpoint, method = "GET", payload } = await req.json();

    if (!apiKey || !endpoint) {
      return NextResponse.json(
        { error: "apiKey 와 endpoint 는 필수입니다." },
        { status: 400 }
      );
    }

    const notionUrl = `https://api.notion.com/v1/${endpoint}`;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
    };

    if (payload && method !== "GET") {
      fetchOptions.body = JSON.stringify(payload);
    }

    const notionRes = await fetch(notionUrl, fetchOptions);
    const data = await notionRes.json();

    if (!notionRes.ok) {
      return NextResponse.json(
        { error: data.message || "Notion API 오류", code: data.code },
        { status: notionRes.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[notion-proxy] error:", err);
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 });
  }
}
