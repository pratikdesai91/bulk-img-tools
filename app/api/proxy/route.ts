import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("❌ Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/*,*/*",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response(
        `❌ Failed to fetch image (${res.status} ${res.statusText})`,
        { status: res.status }
      );
    }

    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await res.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Proxy fetch error:", err.message);
      return new Response(`❌ Server error: ${err.message}`, { status: 500 });
    }
    console.error("Unknown proxy error:", err);
    return new Response("❌ Unknown server error", { status: 500 });
  }
}