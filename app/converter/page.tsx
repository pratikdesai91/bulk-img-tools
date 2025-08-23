"use client";

import { useState } from "react";
import { saveAs } from "file-saver";

export default function BulkBackgroundRemovePage() {
  const [images, setImages] = useState<FileList | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const startProcessing = async () => {
    if (!images) return;
    setProcessing(true);

    for (let i = 0; i < images.length; i++) {
      const file = images[i];

      // 🔑 Replace with your remove.bg API key
      const apiKey = "YOUR_REMOVE_BG_API_KEY";

      try {
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": apiKey,
          },
          body: formData,
        });

        if (!response.ok) {
          console.error("Failed to process:", file.name);
          continue;
        }

        const blob = await response.blob();
        saveAs(blob, `${file.name.replace(/\.[^/.]+$/, "")}-no-bg.png`);
      } catch (error) {
        console.error("Error removing background:", error);
      }
    }

    setProcessing(false);
    alert("✅ Background removal complete. Files downloaded!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">🖼️ Bulk Background Remover</h1>
      <p className="text-gray-600 mb-6">
        Select multiple images and automatically remove their backgrounds.
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