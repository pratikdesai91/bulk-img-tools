"use client";

import { useState } from "react";

export default function BulkBackgroundRemovePage() {
  const [images, setImages] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const startProcessing = async () => {
    if (!images) return;
    setProcessing(true);

    // 🔹 Loop through selected images (for demo)
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      console.log("Processing:", file.name);

      // 🚀 Here we’ll later connect to remove.bg or custom API
      await new Promise((r) => setTimeout(r, 1000)); // simulate API delay
    }

    setProcessing(false);
    alert("✅ Background removal complete (demo).");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">🖼️ Bulk Background Remover</h1>
      <p className="text-gray-600 mb-6">
        Select multiple images from your computer and remove backgrounds in bulk.
      </p>

      {/* Step 1: Browse Images */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Select Images (JPG / PNG)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </div>

      {/* Step 2: Start Process */}
      <button
        disabled={!images || processing}
        onClick={startProcessing}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {processing ? "Processing..." : "Start Background Removal"}
      </button>
    </div>
  );
}