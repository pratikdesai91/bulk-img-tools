import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    res.status(400).send("❌ Missing url parameter");
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/*,*/*",
      },
    });

    if (!response.ok) {
      res
        .status(response.status)
        .send(`❌ Failed to fetch: ${response.statusText}`);
      return;
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.status(200).send(buffer);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Proxy error:", err.message);
      res.status(500).send("❌ Proxy error: " + err.message);
    } else {
      console.error("Unknown proxy error:", err);
      res.status(500).send("❌ Unknown proxy error");
    }
  }
}