"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

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
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Convert File/URL → chosen format
  const convertImage = async (src: string, fileName: string): Promise<Blob> => {
    if (src.startsWith("/api/proxy")) {
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Failed to fetch ${fileName}`);
      const blob = await res.blob();
      return await new Promise<Blob>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = URL.createObjectURL(blob);

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
    }

    // Normal local file (already a blob url)
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
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const total = inputFiles.length + urlList.length;
    if (total === 0) {
      setError("Please upload files or enter URLs.");
      return;
    }

    setIsProcessing(true);
    setProgress({ done: 0, total });
    setError(null);
    setBrokenLinks([]); // reset failures

    try {
      const zip = new JSZip();

      // Local files
      for (const file of inputFiles) {
        if (!allowedTypes.includes(file.type)) {
          console.warn(`Skipping unsupported file: ${file.name}`);
          setBrokenLinks((prev) => [...prev, file.name]);
          setProgress((prev) => ({ done: prev.done + 1, total }));
          continue;
        }

        try {
          const url = URL.createObjectURL(file);
          const blob = await convertImage(url, file.name);
          const fileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
          zip.file(fileName, blob);
        } catch (err) {
          console.warn(`Skipping local file ${file.name}:`, err);
          setBrokenLinks((prev) => [...prev, file.name]);
        }

        setProgress((prev) => ({ done: prev.done + 1, total }));
      }

      // Remote URLs
      for (const link of urlList) {
        try {
          const proxyUrl = `/api/proxy?url=${encodeURIComponent(link)}`;
          const blob = await convertImage(proxyUrl, link);

          let fileName = link.split("/").pop() || `image.${format}`;
          fileName = fileName.replace(/\.[^/.]+$/, `.${format}`);

          zip.file(fileName, blob);
        } catch (err) {
          console.warn(`Skipping URL ${link}:`, err);
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
        setError("An unknown error occurred.");
      }
    }

    setIsProcessing(false);
  };

  const downloadZip = () => {
    if (zipBlob) {
      saveAs(zipBlob, `converted_images_${format}.zip`);
    }
  };

  const downloadBrokenAsTxt = () => {
    if (brokenLinks.length === 0) return;
    const blob = new Blob([brokenLinks.join("\n")], { type: "text/plain" });
    saveAs(blob, "broken_links.txt");
  };

  const downloadBrokenAsCsv = () => {
    if (brokenLinks.length === 0) return;
    const csvContent = brokenLinks.map((link) => `"${link}"`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    saveAs(blob, "broken_links.csv");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🔄 Free Bulk Image Converter
        </h1>
        <p className="font-bold text-black-600 mb-6">
          Convert JPG, PNG, GIF, AVIF & WebP Online — 100% Free
        </p>
        <p className="text-gray-600 mb-6">
          Convert multiple images to WebP, JPG, PNG, GIF, or AVIF in seconds.
          Upload or paste URLs, process instantly, and download all files in a
          single ZIP. Fast, secure & easy online image conversion — all done in
          your browser.
        </p>
      </div>

      {/* Drag & Drop Zone */}
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

      {/* Format Selection */}
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
            <div
              key={i}
              className="relative w-20 h-20 border rounded overflow-hidden"
            >
              <Image
                src={src}
                alt={`preview-${i}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Convert Button */}
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

      {/* Error */}
      {error && <p className="text-red-600 mt-3">{error}</p>}

      {/* Download Section */}
      {zipBlob && !error && !isProcessing && (
        <div className="mt-4 space-y-3">
          <button
            onClick={downloadZip}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
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

      {/* Extra Content for SEO & UX */}
      <div className="mt-12 space-y-10 text-gray-700">
        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold mb-3">Why use our Free Bulk Image Converter?</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Completely free — no signup required.</li>
            <li>Convert JPG, PNG, GIF, WebP, AVIF in seconds.</li>
            <li>Supports both file upload and image URLs.</li>
            <li>Batch processing with ZIP download.</li>
            <li>Works in your browser — no files are uploaded to our servers.</li>
          </ul>
        </section>

        {/* How to Use */}
        <section>
          <h2 className="text-2xl font-bold mb-3">How to use the converter</h2>
          <ol className="list-decimal ml-6 space-y-1">
            <li>Drag & drop or upload your image files.</li>
            <li>Paste image URLs if you want to convert from the web.</li>
            <li>Select the output format (WebP, JPG, PNG, GIF, AVIF).</li>
            <li>Click <b>Convert</b> and wait for processing.</li>
            <li>Download all converted images as a single ZIP.</li>
          </ol>
        </section>

        {/* Supported Formats */}
        <section>
          <h2 className="text-2xl font-bold mb-3">Supported Image Formats</h2>
          <p>
            You can upload images in <b>JPG, PNG, GIF, BMP, WebP, AVIF</b> and convert
            them into modern formats like <b>WebP</b> or <b>AVIF</b> for smaller size and
            better performance.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div>
              <p className="font-semibold">🔒 Are my images safe?</p>
              <p>Yes! All conversions happen in your browser. Your images never leave your device.</p>
            </div>
            <div>
              <p className="font-semibold">📁 Is there a file size limit?</p>
              <p>The converter works best for images under 20MB each, but larger files may also work depending on your device.</p>
            </div>
            <div>
              <p className="font-semibold">💻 Does it work on mobile?</p>
              <p>Yes, the tool works on desktop, tablet, and mobile devices.</p>
            </div>
          </div>
        </section>

        {/* Format Comparison Table */}
        <section>
          <h2 className="text-2xl font-bold mb-3">Image Format Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Format</th>
                  <th className="border px-3 py-2">Best For</th>
                  <th className="border px-3 py-2">Compression</th>
                  <th className="border px-3 py-2">Transparency</th>
                  <th className="border px-3 py-2">Animation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-3 py-2 font-medium">JPEG</td>
                  <td className="border px-3 py-2">Photos & realistic images</td>
                  <td className="border px-3 py-2">Lossy</td>
                  <td className="border px-3 py-2">❌</td>
                  <td className="border px-3 py-2">❌</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium">PNG</td>
                  <td className="border px-3 py-2">Logos, graphics, text</td>
                  <td className="border px-3 py-2">Lossless</td>
                  <td className="border px-3 py-2">✅</td>
                  <td className="border px-3 py-2">❌</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium">GIF</td>
                  <td className="border px-3 py-2">Simple animations</td>
                  <td className="border px-3 py-2">Lossy / Limited colors</td>
                  <td className="border px-3 py-2">✅</td>
                  <td className="border px-3 py-2">✅</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium">WebP</td>
                  <td className="border px-3 py-2">Web images, modern browsers</td>
                  <td className="border px-3 py-2">Lossy / Lossless</td>
                  <td className="border px-3 py-2">✅</td>
                  <td className="border px-3 py-2">✅</td>
                </tr>
                <tr>
                  <td className="border px-3 py-2 font-medium">AVIF</td>
                  <td className="border px-3 py-2">Next-gen compression</td>
                  <td className="border px-3 py-2">Superior Lossy/Lossless</td>
                  <td className="border px-3 py-2">✅</td>
                  <td className="border px-3 py-2">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}