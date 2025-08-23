"use client";

import { useRef, useState, useEffect } from "react";
import Papa from "papaparse";

/** --- File System Access API --- */
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
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

export default function BulkImageMover() {
  const [files, setFiles] = useState<File[]>([]);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [outDirHandle, setOutDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [fsSupport, setFsSupport] = useState(false);
  useEffect(() => {
    setFsSupport(typeof window !== "undefined" && typeof window.showDirectoryPicker === "function");
  }, []);

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
        setCsvData(results.data);
      }
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
    a.download = "template.csv";
    a.click();
  };

  // 🔹 process in small batches
  const BATCH_SIZE = 20;

  const proceed = async () => {
    setErrors([]);
    setProcessedCount(0);

    if (files.length === 0) {
      setStatus("Please select images.");
      return;
    }
    if (csvData.length === 0) {
      setStatus("Please upload CSV file.");
      return;
    }
    if (!outDirHandle) {
      setStatus("Please select an output folder.");
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
            missing.push(`❌ Missing: ${row.original_name}`);
            return;
          }
          try {
            let targetDir = outDirHandle;
            if (row.folder_name && row.folder_name.trim() !== "") {
              targetDir = await outDirHandle.getDirectoryHandle(row.folder_name, { create: true });
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
    } else {
      setStatus("✅ All files moved successfully.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Image Mover</h1>

      {/* ✅ Instructions Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h2 className="font-semibold mb-2">How to use:</h2>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
        <li>Click <b>“Choose Images”</b> to select multiple pictures from your computer.</li>
          <li>Enter the desired <b>Width</b> and <b>Height</b>.</li>
          <li>Select your preferred <b>unit</b> (Pixels, Inches, CM, MM, Points, Picas).</li>
          <li>Click <b>Resize & Download</b> – all resized images will be saved automatically with their original names.</li>
          <li>Aspect ratio is preserved, so products won’t look stretched or squashed.</li>
        </ol>
      </div>

      <button onClick={downloadTemplate} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Download CSV Template
      </button>

      <div className="mb-4">
        <button onClick={handleChooseCsv} className="bg-gray-800 text-white px-4 py-2 rounded">
          Upload CSV
        </button>
        <input ref={csvInputRef} type="file" accept=".csv" onChange={onCsvSelected} className="hidden" />
        <span className="ml-3 text-gray-700">
          {csvData.length > 0 ? `${csvData.length} rows loaded` : "No CSV uploaded"}
        </span>
      </div>

      <div className="mb-4">
        <button onClick={handleChooseFiles} className="bg-gray-800 text-white px-4 py-2 rounded">
          Select Images
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} className="hidden" />
        <span className="ml-3 text-gray-700">
          {files.length > 0 ? `${files.length} file(s)` : "No files selected"}
        </span>
      </div>

      <div className="mb-4">
        <button onClick={handleChooseOutputFolder} className="bg-gray-800 text-white px-4 py-2 rounded">
          Choose Output Folder
        </button>
        <span className="ml-3 text-gray-700">{outDirHandle ? "Folder selected" : "No folder chosen"}</span>
      </div>

      <button onClick={proceed} className="bg-green-600 text-white px-6 py-2 rounded">
        Proceed
      </button>

      {/* progress */}
      {status && (
        <div className="mt-4">
          <p>{status}</p>
          {processedCount > 0 && (
            <p>
              Processed {processedCount} / {csvData.length}
            </p>
          )}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-6 p-4 border bg-red-50 rounded">
          <h3 className="font-semibold text-red-700 mb-2">Errors:</h3>
          <ul className="list-disc list-inside text-red-800">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warning */}
      <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
        ⚠️ <strong>Warning:</strong> Please leave your PC idle while processing large image batches to avoid browser or system freeze.
      </div>
    </div>
  );
}