"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Image from "next/image";

export default function BulkImageConverter() {
  const [images, setImages] = useState<FileList | null>(null);
  const [urls, setUrls] = useState<string>(""); // multiple URLs
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
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
  // If it’s a proxy URL, fetch it as blob first
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

    try {
      const zip = new JSZip();

      for (const file of inputFiles) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`❌ ${file.name} is not a supported format.`);
        }

        const url = URL.createObjectURL(file);
        const blob = await convertImage(url, file.name);
        const fileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
        zip.file(fileName, blob);

        setProgress((prev) => ({ done: prev.done + 1, total }));
      }

      let urlIndex = 1;
      for (const link of urlList) {
        
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(link)}`;
        const blob = await convertImage(proxyUrl, `url_image_${urlIndex}`);

        zip.file(`url_image_${urlIndex}.${format}`, blob);
        urlIndex++;

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🔄 Bulk Image Converter
        </h1>
        <p className="font-bold text-black-600 mb-6">
          Bulk Image Converter | Convert JPG, PNG, GIF, AVIF & WebP Online
        </p>
        <p className="text-gray-600 mb-6">
          Convert multiple images to WebP, JPG, PNG, GIF, or AVIF in seconds.
          Upload or paste URLs, process instantly, and download all files in a
          single ZIP. Fast & easy online image conversion.
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

      {/* Download Button */}
      {zipBlob && !error && !isProcessing && (
        <button
          onClick={downloadZip}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          ⬇️ Download {format.toUpperCase()} ZIP
        </button>
      )}
    </div>
  );
}