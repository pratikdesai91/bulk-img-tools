"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FeedbackPopup from "@/app/components/FeedbackPopup";

/** ✅ Extend only missing parts instead of redeclaring */
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
  interface FileSystemDirectoryHandle {
    getFileHandle(
      name: string,
      options?: { create?: boolean }
    ): Promise<FileSystemFileHandle>;
  }
  interface FileSystemFileHandle {
    createWritable(
      options?: FileSystemCreateWritableOptions
    ): Promise<FileSystemWritableFileStream>;
  }
  interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
  }
  interface FileSystemWritableFileStream {
    write(data: Blob | BufferSource | string): Promise<void>;
    close(): Promise<void>;
  }
}

type Unit = "px" | "in" | "cm" | "mm" | "pt" | "pc";

export default function BulkImageResizePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [outDirHandle, setOutDirHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("px");
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<string>("");
  const [failed, setFailed] = useState<string[]>([]);
  const [processed, setProcessed] = useState<number>(0);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const DPI = 96;

  const [fsSupport, setFsSupport] = useState<boolean>(false);
  useEffect(() => {
    setFsSupport(
      typeof window !== "undefined" &&
        typeof window.showDirectoryPicker === "function"
    );
  }, []);

  // 🔔 Auto-open feedback when done
  useEffect(() => {
    if (!isRunning && files.length > 0 && processed === files.length) {
      const t = setTimeout(() => setFeedbackOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isRunning, processed, files.length]);

  const handleChooseFiles = () => fileInputRef.current?.click();

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
  };

  const handleChooseOutputFolder = async () => {
    try {
      if (!fsSupport || !window.showDirectoryPicker) {
        setStatus(
          "This browser does not support choosing a folder. Files will download individually."
        );
        setOutDirHandle(null);
        return;
      }
      const dirHandle = await window.showDirectoryPicker();
      setOutDirHandle(dirHandle);
      setStatus("Output folder selected.");
    } catch {
      // user canceled
    }
  };

  const unitToPixels = (value: number, u: Unit): number => {
    switch (u) {
      case "px": return value;
      case "in": return value * DPI;
      case "cm": return (value / 2.54) * DPI;
      case "mm": return (value / 25.4) * DPI;
      case "pt": return (value / 72) * DPI;
      case "pc": return (value / 6) * DPI;
    }
  };

  const loadImageFromFile = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(img.src); resolve(img); };
      img.onerror = () => reject(new Error("Image load error"));
      img.src = URL.createObjectURL(file);
    });

  const canvasResize = async (
    img: HTMLImageElement,
    targetW: number,
    targetH: number,
    preferType: string
  ): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const aspectRatio = img.width / img.height;
      let newW = targetW, newH = targetH;
      if (targetW / targetH > aspectRatio) {
        newW = targetH * aspectRatio; newH = targetH;
      } else {
        newW = targetW; newH = targetW / aspectRatio;
      }
      const canvas = document.createElement("canvas");
      canvas.width = targetW; canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));
      if (preferType.includes("jpeg") || preferType.includes("jpg")) {
        ctx.fillStyle = "white"; ctx.fillRect(0, 0, targetW, targetH);
      }
      const offsetX = (targetW - newW) / 2;
      const offsetY = (targetH - newH) / 2;
      ctx.drawImage(img, offsetX, offsetY, newW, newH);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("toBlob failed")),
        preferType || "image/png",
        preferType.includes("jpeg") ? 0.92 : undefined
      );
    });

  const saveBlobToChosenFolder = async (blob: Blob, filename: string) => {
    if (!outDirHandle) return;
    const fileHandle = await outDirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob); await writable.close();
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const startResize = async () => {
    setStatus(""); setFailed([]); setProcessed(0); setProgress("");
    if (files.length === 0) return setStatus("Please select images.");
    const w = parseFloat(width), h = parseFloat(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0)
      return setStatus("Enter valid Width and Height > 0.");
    const targetW = unitToPixels(w, unit), targetH = unitToPixels(h, unit);
    setStatus(`Resizing ${files.length} image(s)...`); setIsRunning(true);
    for (const [index, file] of files.entries()) {
      try {
        const img = await loadImageFromFile(file);
        const outBlob = await canvasResize(img, targetW, targetH, file.type);
        if (outDirHandle) await saveBlobToChosenFolder(outBlob, file.name);
        else triggerDownload(outBlob, file.name);
      } catch { setFailed((p) => [...p, file.name]); }
      finally {
        setProcessed((p) => p + 1);
        setProgress(`${index + 1} / ${files.length} processed`);
      }
    }
    setStatus("Done."); setIsRunning(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ---------- GRID LAYOUT ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- MAIN CONTENT ---------- */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">📐 Bulk Image Resize</h1>
          <p className="text-gray-600 mb-6">
            Quickly resize multiple images to exact dimensions in pixels, cm, or inches.
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">How to Use:</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Browse image(s) from your local drive.</li>
              <li>Select a folder to save resized images (or download individually).</li>
              <li>Enter <b>Width</b> & <b>Height</b>, then choose <b>Units</b>.</li>
              <li>Click <b>Start Resize</b>.</li>
              <li><Link href="/blogs/bulk-images-resize" className="text-blue-700 hover:underline">Quick Guide: Bulk Images Resize</Link></li>
            </ol>
          </div>

          {/* File Inputs */}
          <div className="mb-4">
            <button
              onClick={handleChooseFiles}
              className="bg-gray-800 text-white px-4 py-2 rounded"
              disabled={isRunning}
            >
              Browse Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onFilesSelected}
              className="hidden"
            />
            <span className="ml-3 text-gray-700">
              {files.length > 0 ? `${files.length} file(s)` : "No files selected"}
            </span>
          </div>

          <div className="mb-6">
            <button
              onClick={handleChooseOutputFolder}
              className="bg-gray-800 text-white px-4 py-2 rounded"
              disabled={isRunning}
            >
              Save to Folder
            </button>
            <span className="ml-3 text-gray-700">
              {outDirHandle ? "Folder selected" : "Default: downloads"}
            </span>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Units</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="w-full border px-3 py-2 rounded"
                disabled={isRunning}
              >
                <option value="px">Pixels</option>
                <option value="in">Inches</option>
                <option value="cm">CM</option>
                <option value="mm">MM</option>
                <option value="pt">Points</option>
                <option value="pc">Picas</option>
              </select>
            </div>
          </div>

          {/* Start */}
          <button
            onClick={startResize}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 disabled:opacity-60"
            disabled={isRunning}
          >
            {isRunning ? "Resizing..." : "Start Resize"}
          </button>

          {(status || progress) && (
            <div className="mt-4">
              <p className="font-medium">{status}</p>
              <p className="text-sm text-gray-600">{progress}</p>
              <p className="text-sm text-gray-600">
                Processed: {processed} / {files.length}
              </p>
            </div>
          )}

          {failed.length > 0 && (
            <div className="mt-6 p-4 border bg-red-50 rounded">
              <h3 className="font-semibold text-red-700 mb-2">Failed:</h3>
              <ul className="list-disc list-inside text-red-800">
                {failed.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ---------- RIGHT SIDEBAR ---------- */}
        <aside className="space-y-8">
          <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">📘 Related Blog Guides</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><Link href="/blogs/bulk-images-resize" className="text-blue-700 hover:underline">Quick Guide: Bulk Images Resize</Link></li>
              <li><Link href="/blog/how-to-optimize-and-convert-images-online-for-free" className="text-blue-700 hover:underline">Optimize & Convert Images</Link></li>
              <li><Link href="/blog/image-format" className="text-blue-700 hover:underline">Learn About Image Formats</Link></li>
            </ul>
          </div>

          <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">🛠️ Try Other Tools</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><Link href="/tools/bulk-image-download" className="text-blue-700 hover:underline">📥 Bulk Image Download</Link></li>
              <li><Link href="/tools/bulk-image-converter" className="text-blue-700 hover:underline">🔄 Bulk Image Converter</Link></li>
              <li><Link href="/tools/bulk-image-renamin" className="text-blue-700 hover:underline">✏️ Bulk Image Renaming</Link></li>
              <li><Link href="/tools/move-images-to-folders" className="text-blue-700 hover:underline">📂 Move Images to Folders</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ---------- FAQ SECTION ---------- */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">Can I resize images without losing quality?</h3>
            <p className="text-gray-600">Resizing always adjusts pixels, but using PNG or WebP maintains higher quality compared to JPEG.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Where are resized images saved?</h3>
            <p className="text-gray-600">By default, they are downloaded to your browser’s Downloads folder unless you select a custom folder.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Does this tool support bulk images?</h3>
            <p className="text-gray-600">Yes, you can upload and resize multiple images at once, all processed automatically.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Is Bulk Image Resize free?</h3>
            <p className="text-gray-600">Yes, it’s completely free with no registration required.</p>
          </div>
        </div>
      </section>

      {/* ⭐ Feedback Popup */}
      <FeedbackPopup show={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}