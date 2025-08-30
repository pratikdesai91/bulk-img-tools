"use client";

import { useRef, useState, useEffect } from "react";
import Papa from "papaparse";
import Link from "next/link";
import FeedbackPopup from "@/app/components/FeedbackPopup";

/** --- File System Access API --- */
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
  interface FileSystemDirectoryHandle {
    getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<FileSystemDirectoryHandle>;
    getFileHandle(name: string, options?: { create?: boolean }): Promise<FileSystemFileHandle>;
  }
  interface FileSystemFileHandle {
    createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
  }
  interface FileSystemWritableFileStream {
    write(data: Blob | BufferSource | string): Promise<void>;
    close(): Promise<void>;
  }
}

type CsvRow = {
  original_name: string;
  new_name: string;
  folder_name?: string;
};

type RunResult = null | "success" | "partial" | "error";

export default function BulkImageMover() {
  const [files, setFiles] = useState<File[]>([]);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [outDirHandle, setOutDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [runResult, setRunResult] = useState<RunResult>(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [fsSupport, setFsSupport] = useState(false);
  useEffect(() => {
    setFsSupport(typeof window !== "undefined" && typeof window.showDirectoryPicker === "function");
  }, []);

  // ✅ Auto-open feedback after a successful run
  useEffect(() => {
    if (runResult === "success") {
      const t = setTimeout(() => setFeedbackOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [runResult]);

  const handleChooseFiles = () => fileInputRef.current?.click();
  const handleChooseCsv = () => csvInputRef.current?.click();

  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selected);
  };

  const onCsvSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(
          results.data.map((row) => ({
            original_name: (row.original_name || "").trim(),
            new_name: (row.new_name || "").trim(),
            folder_name: (row.folder_name || "").trim(),
          }))
        );
      },
    });
  };

  const handleChooseOutputFolder = async () => {
    try {
      if (!fsSupport || !window.showDirectoryPicker) {
        setStatus("This browser does not support choosing a folder.");
        return;
      }
      const dirHandle = await window.showDirectoryPicker();
      setOutDirHandle(dirHandle);
      setStatus("Output folder selected.");
    } catch {
      // user canceled
    }
  };

  const downloadTemplate = () => {
    const template = "original_name,new_name,folder_name\n";
    const blob = new Blob([template], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "move-images-to-folders.csv";
    a.click();
  };

  // 🔹 process in small batches
  const BATCH_SIZE = 20;

  const proceed = async () => {
    setErrors([]);
    setProcessedCount(0);
    setRunResult(null);

    if (files.length === 0) {
      setStatus("Please select images.");
      setRunResult("error");
      return;
    }
    if (csvData.length === 0) {
      setStatus("Please upload CSV file.");
      setRunResult("error");
      return;
    }
    if (!outDirHandle) {
      setStatus("Please select an output folder.");
      setRunResult("error");
      return;
    }

    // Optional: strict validation for CSV rows
    const invalidRows = csvData
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => !r.original_name || !r.new_name);
    if (invalidRows.length) {
      setStatus("CSV has missing values. Please ensure original_name and new_name are filled.");
      setErrors(invalidRows.map(({ i }) => `Row ${i + 2}: Missing original_name or new_name`));
      setRunResult("error");
      return;
    }

    setStatus("Processing...");

    const fileMap = new Map(files.map((f) => [f.name, f]));
    const total = csvData.length;
    const missing: string[] = [];

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = csvData.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (row) => {
          const file = fileMap.get(row.original_name);
          if (!file) {
            missing.push(`❌ Missing file: ${row.original_name}`);
            setProcessedCount((prev) => prev + 1);
            return;
          }
          try {
            let targetDir = outDirHandle!;
            if (row.folder_name) {
              targetDir = await outDirHandle!.getDirectoryHandle(row.folder_name, { create: true });
            }

            const newFileHandle = await targetDir.getFileHandle(row.new_name, { create: true });
            const writable = await newFileHandle.createWritable();
            await writable.write(await file.arrayBuffer());
            await writable.close();
          } catch (err) {
            missing.push(`⚠️ Error: ${row.original_name} → ${String(err)}`);
          } finally {
            setProcessedCount((prev) => prev + 1);
          }
        })
      );
    }

    if (missing.length > 0) {
      setErrors(missing);
      setStatus("⚠️ Completed with some errors.");
      setRunResult("partial");
    } else {
      setStatus("✅ All files moved successfully.");
      setRunResult("success");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ---------- GRID LAYOUT ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- MAIN CONTENT ---------- */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">Bulk Image Renamer & Mover</h1>
          <p className="mb-4 text-gray-700">
            Sort, rename, and move images into folders instantly based on a CSV mapping file.
          </p>

          {/* ✅ Instructions Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">How to Use</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Click <b>Download CSV Template</b> and open <code>move-images-to-folders.csv</code>.</li>
              <li>
                Fill <b>original_name</b> and <b>new_name</b> (include extensions like <code>.jpg</code>, <code>.png</code>).
                Optionally add <b>folder_name</b> to target a sub-folder.
              </li>
              <li>Upload the CSV, browse and select the images, then choose an output folder.</li>
              <li>Click <b>Proceed</b> to start moving/renaming in batches.</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button onClick={downloadTemplate} className="bg-blue-600 text-white px-4 py-2 rounded">
              Download CSV Template
            </button>

            <button onClick={handleChooseCsv} className="bg-gray-800 text-white px-4 py-2 rounded">
              Upload CSV
            </button>
            <input ref={csvInputRef} type="file" accept=".csv" onChange={onCsvSelected} className="hidden" />
            <span className="text-gray-700">
              {csvData.length > 0 ? `${csvData.length} row(s) loaded` : "No CSV uploaded"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button onClick={handleChooseFiles} className="bg-gray-800 text-white px-4 py-2 rounded">
              Browse Images
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} className="hidden" />
            <span className="text-gray-700">
              {files.length > 0 ? `${files.length} file(s) selected` : "No files selected"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button onClick={handleChooseOutputFolder} className="bg-gray-800 text-white px-4 py-2 rounded">
              Choose Output Folder
            </button>
            <span className="text-gray-700">{outDirHandle ? "Folder selected" : "No folder chosen"}</span>
          </div>

          <button onClick={proceed} className="bg-green-600 text-white px-6 py-2 rounded">
            Proceed
          </button>

          {/* progress */}
          {status && (
            <div className="mt-4">
              <p>{status}</p>
              {processedCount > 0 && csvData.length > 0 && (
                <p>
                  Processed {processedCount} / {csvData.length}
                </p>
              )}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-6 p-4 border bg-red-50 rounded">
              <h3 className="font-semibold text-red-700 mb-2">Errors</h3>
              <ul className="list-disc list-inside text-red-800">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning */}
          <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            ⚠️ <strong>Heads up:</strong> The File System Access API works best in Chromium-based browsers.
            For large batches, avoid heavy multitasking while processing.
          </div>
        </div>

        {/* ---------- RIGHT SIDEBAR ---------- */}
        <aside className="space-y-8">
          <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">📘 Related Blog Guides</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <Link href="/blogs/move-images-to-folders" className="text-blue-700 hover:underline">
                  Quick Guide: Bulk Image Renamer & Mover
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-optimize-and-convert-images-online-for-free" className="text-blue-700 hover:underline">
                  Optimize and Convert Images Online
                </Link>
              </li>
              <li>
                <Link href="/blog/image-format" className="text-blue-700 hover:underline">
                  Learn About Image Formats
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">🛠️ Try Other Tools</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><Link href="/tools/bulk-image-download" className="text-blue-700 hover:underline">📥 Bulk Image Download</Link></li>
              <li><Link href="/tools/bulk-image-resize" className="text-blue-700 hover:underline">📐 Bulk Image Resize</Link></li>
              <li><Link href="/tools/bulk-image-converter" className="text-blue-700 hover:underline">🔄 Bulk Image Converter</Link></li>
              <li><Link href="/tools/bulk-image-renamin" className="text-blue-700 hover:underline">✏️ Bulk Image Renaming</Link></li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ---------- FAQ SECTION ---------- */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              What is the purpose of the CSV file?
            </h3>
            <p className="text-gray-600">
              The CSV defines how each file should be renamed and optionally what folder to move it into.
              Columns: <code>original_name</code>, <code>new_name</code>, and optional <code>folder_name</code>.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Can I create new folders automatically?
            </h3>
            <p className="text-gray-600">
              Yes! If you specify a <code>folder_name</code> in the CSV, the tool will create that folder if it doesn’t exist.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Which browsers are supported?
            </h3>
            <p className="text-gray-600">
              The File System Access API works best in Chromium browsers (Chrome, Edge, Brave).
              Safari and Firefox may not fully support it.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Is there a file limit?
            </h3>
            <p className="text-gray-600">
              There’s no strict limit, but processing very large batches may cause your browser to slow down.
              We recommend working in chunks of a few hundred files.
            </p>
          </div>
        </div>
      </section>

      {/* ⭐ Auto Feedback Popup */}
      <FeedbackPopup show={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}