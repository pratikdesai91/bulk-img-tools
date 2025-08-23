import { NextResponse } from "next/server";
import archiver from "archiver";

/**
 * Parse CSV manually (expecting: original_name,new_name)
 */
async function parseCsv(file: File): Promise<Record<string, string>> {
  const text = await file.text();
  const lines = text.trim().split("\n");
  const map: Record<string, string> = {};

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const [original, renamed] = lines[i].split(",");
    if (original && renamed) {
      map[original.trim()] = renamed.trim();
    }
  }

  return map;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const csvFile = formData.get("csv") as File | null;
    const images = formData.getAll("images") as File[];

    if (!csvFile || images.length === 0) {
      return NextResponse.json(
        { error: "CSV file and at least one image are required" },
        { status: 400 }
      );
    }

    // ✅ Parse CSV → { original_name: new_name }
    const csvMap = await parseCsv(csvFile);

    // ✅ Build ZIP in memory
    const chunks: Buffer[] = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("error", (err) => {
      throw err;
    });

    for (const img of images) {
      const buffer = Buffer.from(await img.arrayBuffer());
      const origName = img.name;
      const newName = csvMap[origName] || origName; // fallback: keep original
      archive.append(buffer, { name: newName });
    }

    await archive.finalize();
    const zipBuffer = Buffer.concat(chunks);

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=renamed_images.zip",
      },
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}