"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";
import Link from "next/link";

export default function BulkImageConverter() {
  const [images, setImages] = useState<FileList | null>(null);
  const [urls, setUrls] = useState<string>("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [brokenLinks, setBrokenLinks] = useState<string[]>([]);
  const [format, setFormat] = useState<
    "webp" | "jpeg" | "png" | "gif" | "avif"
  >("webp");

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/avif",
  ];

  const handleFiles = (files: FileList) => {
    setImages(files);
    setZipBlob(null);
    setError(null);

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const convertImage = async (src: string, fileName: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = src;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas error"));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Conversion failed"))),
          `image/${format}`,
          0.9
        );
      };

      img.onerror = () => reject(new Error("Failed to load " + fileName));
    });
  };

  const convertAll = async () => {
    const inputFiles = images ? Array.from(images) : [];
    const urlList = urls.split("\n").map((u) => u.trim()).filter(Boolean);

    const total = inputFiles.length + urlList.length;
    if (total === 0) {
      setError("Please upload files or enter URLs.");
      return;
    }

    setIsProcessing(true);
    setProgress({ done: 0, total });
    setError(null);
    setBrokenLinks([]);

    try {
      const zip = new JSZip();

      for (const file of inputFiles) {
        if (!allowedTypes.includes(file.type)) {
          setBrokenLinks((prev) => [...prev, file.name]);
          setProgress((prev) => ({ done: prev.done + 1, total }));
          continue;
        }
        try {
          const url = URL.createObjectURL(file);
          const blob = await convertImage(url, file.name);
          const fileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
          zip.file(fileName, blob);
        } catch {
          setBrokenLinks((prev) => [...prev, file.name]);
        }
        setProgress((prev) => ({ done: prev.done + 1, total }));
      }

      for (const link of urlList) {
        try {
          const blob = await convertImage(link, link);
          let fileName = link.split("/").pop() || `image.${format}`;
          fileName = fileName.replace(/\.[^/.]+$/, `.${format}`);
          zip.file(fileName, blob);
        } catch {
          setBrokenLinks((prev) => [...prev, link]);
        }
        setProgress((prev) => ({ done: prev.done + 1, total }));
      }

      const zipOut = await zip.generateAsync({ type: "blob" });
      setZipBlob(zipOut);
} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unknown error");
  }
}

    setIsProcessing(false);
  };

  const downloadZip = () => zipBlob && saveAs(zipBlob, `converted_images_${format}.zip`);
  const downloadBrokenAsTxt = () =>
    brokenLinks.length &&
    saveAs(new Blob([brokenLinks.join("\n")], { type: "text/plain" }), "broken_links.txt");
  const downloadBrokenAsCsv = () =>
    brokenLinks.length &&
    saveAs(
      new Blob([brokenLinks.map((l) => `"${l}"`).join("\n")], { type: "text/csv" }),
      "broken_links.csv"
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ---------- MAIN CONVERTER ---------- */}
      <div className="lg:col-span-2">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔄 Free Bulk Image Converter
          </h1>
          <p className="font-bold mb-4">
            Convert JPG, PNG, GIF, AVIF & WebP Online — 100% Free
          </p>
          <p className="text-gray-600">
            Upload or paste URLs, process instantly, and download all files in a single ZIP.
            Fast, secure & easy — all done in your browser.
          </p>
        </div>

        {/* Drag & Drop */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 mb-4 cursor-pointer hover:bg-gray-100"
        >
          <p className="text-gray-600">📂 Drag & Drop images here</p>
          <p className="text-sm text-gray-500">or click below to browse</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/avif"
            multiple
            onChange={handleFileChange}
            className="mt-2"
          />
        </div>

        {/* URL Input */}
        <textarea
          placeholder="Paste image URLs here (one per line)"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          className="w-full border rounded p-2 mb-4 h-24"
        ></textarea>

        {/* Format */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Convert To:</label>
          <select
            value={format}
            onChange={(e) =>
  setFormat(
    e.target.value as "webp" | "jpeg" | "png" | "gif" | "avif"
  )
}
            className="border rounded px-2 py-1"
          >
            <option value="webp">WebP</option>
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="gif">GIF</option>
            <option value="avif">AVIF</option>
          </select>
        </div>

        {/* Thumbnails */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 border rounded overflow-hidden">
                <Image src={src} alt={`preview-${i}`} fill sizes="80px" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button
          onClick={convertAll}
          disabled={isProcessing}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isProcessing ? "Processing..." : `Convert to ${format.toUpperCase()}`}
        </button>

        {/* Progress */}
        {isProcessing && (
          <p className="mt-3 text-sm text-gray-600">
            Processing {progress.done}/{progress.total} images...
          </p>
        )}
        {error && <p className="text-red-600 mt-3">{error}</p>}

        {/* Download */}
        {zipBlob && !isProcessing && (
          <div className="mt-4 space-y-3">
            <button onClick={downloadZip} className="bg-green-600 text-white px-4 py-2 rounded">
              ⬇️ Download {format.toUpperCase()} ZIP
            </button>
            {brokenLinks.length > 0 && (
              <div className="mt-4">
                <p className="text-red-600 mb-2">
                  ⚠️ {brokenLinks.length} file(s) could not be processed.
                </p>
                <button
                  onClick={downloadBrokenAsTxt}
                  className="bg-gray-600 text-white px-3 py-1 rounded mr-2"
                >
                  ⬇️ Download TXT
                </button>
                <button
                  onClick={downloadBrokenAsCsv}
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                >
                  ⬇️ Download CSV
                </button>
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Are my images safe?</h3>
              <p>Yes all conversions happen in your browser. Nothing is uploaded.</p>
            </div>
            <div>
              <h3 className="font-semibold">Which formats are supported?</h3>
              <p>Upload JPG, PNG, GIF, BMP, WebP, or AVIF, and convert to WebP, JPG, PNG, GIF, or AVIF.</p>
            </div>
            <div>
              <h3 className="font-semibold">Is this tool free?</h3>
              <p>Yes, 100% free. No signup or account required.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- SIDEBAR ---------- */}
      <aside className="space-y-8">
        <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">📘 Related Blog Guides</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <Link href="/blogs/how-to-optimize-and-convert-images-online-for-free" className="text-blue-700 hover:underline">
                  Optimize and Convert Images Online
                </Link>
              </li>
              <li>
                <Link href="/blogs/image-format" className="text-blue-700 hover:underline">
                  Learn About Image Formats
                </Link>
              </li>
            </ul>
          </div>

        <div className="p-4 bg-white border rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-3">🛠️ Try Other Tools</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <Link href="/tools/bulk-image-download" className="text-blue-700 hover:underline">
                📥 Bulk Image Download
              </Link>
            </li>
            <li>
              <Link href="/tools/bulk-image-resize" className="text-blue-700 hover:underline">
                📐 Bulk Image Resize
              </Link>
            </li>
            <li>
              <Link href="/tools/bulk-image-renamin" className="text-blue-700 hover:underline">
                ✏️ Bulk Image Renaming
              </Link>
            </li>
            <li>
              <Link href="/tools/move-images-to-folders" className="text-blue-700 hover:underline">
                📂 Move Images to Folders
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}