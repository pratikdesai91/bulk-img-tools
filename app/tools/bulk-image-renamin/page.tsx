"use client";
import { useState } from "react";

export default function Home() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadTemplate = () => {
    const header = "original_name,new_name\n";
    const example = "example.jpg,renamed_example.jpg\n";
    const blob = new Blob([header + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProceed = async () => {
    if (!csvFile || !images) {
      alert("Please upload CSV and images");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("csv", csvFile);
    Array.from(images).forEach((img) => formData.append("images", img));

    const res = await fetch("/api/rename", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      setLoading(false);
      if (err.error === "Validation failed") {
        alert(
          `❌ Validation failed:\n` +
            (err.missingInCsv.length
              ? `Images missing in CSV: ${err.missingInCsv.join(", ")}\n`
              : "") +
            (err.missingImages.length
              ? `CSV entries with no images: ${err.missingImages.join(", ")}`
              : "")
        );
      } else {
        alert("❌ Error: " + err.error);
      }
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renamed_images.zip";
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bulk Image Rename Tool</h1>

      {/* Instructions */}
      {/* ✅ Instructions Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          How to Use:
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Download the CSV template.</li>
          <li>Fill in <strong>original_name</strong> and <strong>new_name</strong> (include file extensions like .jpg, .png).</li>
          <li>Upload the completed CSV file.</li>
          <li>Upload the images you want to rename.</li>
          <li>Click <strong>Proceed</strong> to generate and download a ZIP file of renamed images.</li>
        </ol>
        </ul>
        </div>

      {/* Download template */}
      <button
        onClick={handleDownloadTemplate}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-6"
      >
        Download CSV Template
      </button>

      {/* Upload CSV */}
      <div className="mb-4">
        <label className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer inline-block">
          Upload CSV Template
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          />
        </label>
        {csvFile && <p className="mt-2 text-sm text-gray-600">{csvFile.name}</p>}
      </div>

      {/* Upload Images */}
      <div className="mb-4">
        <label className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer inline-block">
          Upload Images
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,.gif"
            className="hidden"
            onChange={(e) => setImages(e.target.files)}
          />
        </label>
        {images && (
          <p className="mt-2 text-sm text-gray-600">
            {images.length} image(s) selected
          </p>
        )}
      </div>

      {/* Proceed button */}
      <button
        onClick={handleProceed}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
        }`}
      >
        {loading ? "Processing..." : "Proceed"}
      </button>
    </main>
  );
}