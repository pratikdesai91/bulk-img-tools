import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    // Fetch image server-side (avoids CORS)
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const blob = await response.arrayBuffer();
    const filename = url.split("/").pop() || "image.jpg";

    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
} catch (err) {
  console.error("Download error:", err);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
}