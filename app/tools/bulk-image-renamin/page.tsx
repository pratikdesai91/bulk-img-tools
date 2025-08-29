"use client";

import { useRef, useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
import useFeedback from "@/app/hooks/useFeedback";
import FeedbackPopup from "@/app/components/FeedbackPopup";

/** --- File System Access API --- */
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
  interface FileSystemFileHandle {
    createWritable(
      options?: FileSystemCreateWritableOptions
    ): Promise<FileSystemWritableFileStream>;
  }
  interface FileSystemWritableFileStream {
    write(data: Blob | BufferSource | string): Promise<void>;
    close(): Promise<void>;
  }
}

type CsvRow = {
  original_name: string;
  new_name: string;
};

export default function BulkImageMover() {
  const [files, setFiles] = useState<File[]>([]);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [outDirHandle, setOutDirHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [status, setStatus] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [fsSupport, setFsSupport] = useState<boolean>(false);
  useEffect(() => {
    setFsSupport(
      typeof window !== "undefined" &&
        typeof window.showDirectoryPicker === "function"
    );
  }, []);

  // ⭐ Feedback hook (triggered when all files moved successfully)
  const { feedbackOpen, setFeedbackOpen } = useFeedback(
    status === "✅ All files moved successfully."
  );

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
      complete: (results: ParseResult<CsvRow>) => {
        setCsvData(results.data);
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
    const template = "original_name,new_name\n";
    const blob = new Blob([template], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bulk-image-renaming.csv";
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
        batch.map(async (row: CsvRow) => {
          const file = fileMap.get(row.original_name);
          if (!file) {
            missing.push(`❌ Missing: ${row.original_name}`);
            return;
          }
          try {
            // ✅ always save to root output folder
            const newFileHandle = await outDirHandle.getFileHandle(
              row.new_name,
              { create: true }
            );
            const writable = await newFileHandle.createWritable();
            await writable.write(await file.arrayBuffer());
            await writable.close();
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : String(err);
            missing.push(
              `⚠️ Error: ${row.original_name} → ${message}`
            );
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
      <h1 className="text-2xl font-bold mb-6">Bulk Image Renaming</h1>

      {/* Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">
          How to Use:
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          <li>Download the CSV template.</li>
          <li>
            Open downloaded <strong>bulk-image-renaming.csv</strong> and
            fill in <strong>original_name</strong> and{" "}
            <strong>new_name</strong> (include file extensions like
            .jpg, .png).
          </li>
          <li>Browse the images you want to rename.</li>
          <li>Select the folder to save images.</li>
          <li>Click Proceed to start renaming.</li>
        </ol>
      </div>

      <button
        onClick={downloadTemplate}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Download CSV Template
      </button>

      <div className="mb-4">
        <button
          onClick={handleChooseCsv}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Upload CSV
        </button>
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={onCsvSelected}
          className="hidden"
        />
        <span className="ml-3 text-gray-700">
          {csvData.length > 0
            ? `${csvData.length} rows loaded`
            : "No CSV uploaded"}
        </span>
      </div>

      <div className="mb-4">
        <button
          onClick={handleChooseFiles}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Select Images
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
          {files.length > 0
            ? `${files.length} file(s)`
            : "No files selected"}
        </span>
      </div>

      <div className="mb-4">
        <button
          onClick={handleChooseOutputFolder}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Choose Output Folder
        </button>
        <span className="ml-3 text-gray-700">
          {outDirHandle ? "Folder selected" : "No folder chosen"}
        </span>
      </div>

      <button
        onClick={proceed}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
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
        ⚠️ <strong>Warning:</strong> Please leave your PC idle while
        processing large batches to avoid freeze.
      </div>

      {/* Feedback popup */}
      <FeedbackPopup
        show={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
}