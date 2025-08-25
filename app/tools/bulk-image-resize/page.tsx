"use client";

import { useEffect, useRef, useState } from "react";

/** ✅ Extend only missing parts instead of redeclaring */
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }

  // In case TS lib.dom is outdated, add fallback
  interface FileSystemDirectoryHandle {
    getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  }

  interface FileSystemFileHandle {
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
  }
}

type Unit = "px" | "in" | "cm" | "mm" | "pt" | "pc";

export default function BulkImageResizePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [outDirHandle, setOutDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("px");
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<string>("");
  const [failed, setFailed] = useState<string[]>([]);
  const [processed, setProcessed] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const DPI = 96;

  const [fsSupport, setFsSupport] = useState<boolean>(false);
  useEffect(() => {
    setFsSupport(typeof window !== "undefined" && typeof window.showDirectoryPicker === "function");
  }, []);

  const handleChooseFiles = () => fileInputRef.current?.click();

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
  };

  const handleChooseOutputFolder = async () => {
    try {
      if (!fsSupport || !window.showDirectoryPicker) {
        setStatus("This browser does not support choosing a folder. Files will download individually.");
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
      img.onload = () => resolve(img);
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

      let newW = targetW;
      let newH = targetH;

      if (targetW / targetH > aspectRatio) {
        newW = targetH * aspectRatio;
        newH = targetH;
      } else {
        newW = targetW;
        newH = targetW / aspectRatio;
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      if (preferType.includes("jpeg") || preferType.includes("jpg")) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      const offsetX = (targetW - newW) / 2;
      const offsetY = (targetH - newH) / 2;
      ctx.drawImage(img, offsetX, offsetY, newW, newH);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("toBlob failed"));
        },
        preferType || "image/png",
        preferType.includes("jpeg") ? 0.92 : undefined
      );
    });

  const saveBlobToChosenFolder = async (blob: Blob, filename: string): Promise<void> => {
    if (!outDirHandle) return;
    const fileHandle = await outDirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const startResize = async () => {
    setStatus("");
    setFailed([]);
    setProcessed(0);
    setProgress("");

    if (files.length === 0) {
      setStatus("Please select one or more images to resize.");
      return;
    }
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      setStatus("Please enter a valid Width and Height greater than 0.");
      return;
    }

    const targetW = unitToPixels(w, unit);
    const targetH = unitToPixels(h, unit);

    setStatus(`Resizing ${files.length} image(s)...`);

    for (const [index, file] of files.entries()) {
      try {
        const img = await loadImageFromFile(file);
        const outBlob = await canvasResize(img, targetW, targetH, file.type);

        const originalName = file.name;

        if (outDirHandle) {
          await saveBlobToChosenFolder(outBlob, originalName);
        } else {
          triggerDownload(outBlob, originalName);
        }
      } catch {
        setFailed((prev) => [...prev, file.name]);
      } finally {
        setProcessed((p) => p + 1);
        setProgress(`${index + 1} / ${files.length} processed`);
      }
    }

    setStatus("Done.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Images Resize</h1>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">How to Use:</h2>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Browse image from local drive</li>
          <li>Select resized folder you want to save images.</li>
          <li>Fill <b>Width and Height</b> boxes with numbers.</li>
          <li>Click Proceed to Start resizing.</li>
        </ol>
      </div>

      {/* Buttons */}
      <div className="mb-4">
        <button onClick={handleChooseFiles} className="bg-gray-800 text-white px-4 py-2 rounded">
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
        <button onClick={handleChooseOutputFolder} className="bg-gray-800 text-white px-4 py-2 rounded">
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Units</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="w-full border px-3 py-2 rounded"
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

      {/* Start Button */}
      <button
        onClick={startResize}
        className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
      >
        Start Resize
      </button>

      {/* Status */}
      {(status || progress) && (
        <div className="mt-4">
          <p>{status}</p>
          <p className="text-sm text-gray-600">Processed: {processed} / {files.length}</p>        </div>
      )}

      {/* Failed */}
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
  );
}