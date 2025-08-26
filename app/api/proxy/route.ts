import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        // Helps with CORS bypass if server allows it
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) {
      return new Response(`Failed to fetch image`, { status: 500 });
    }

    const blob = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new Response(blob, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    return new Response("Error fetching image", { status: 500 });
  }
}