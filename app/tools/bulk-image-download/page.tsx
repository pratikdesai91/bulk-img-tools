"use client";

import { useState } from "react";
import Link from "next/link";
import FeedbackPopup from "@/app/components/FeedbackPopup";
import useFeedback from "app/hooks/useFeedbackTrigger";

export default function MultiImageDownloaderPage() {
  const [urls, setUrls] = useState<string>("");
  const [failed, setFailed] = useState<string[]>([]);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const { feedbackOpen, setFeedbackOpen } = useFeedback(taskCompleted);

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = url.split("/").pop() || "image.jpg";
      link.click();

      return true;
    } catch {
      return false;
    }
  };

  const handleDownload = async () => {
    const urlList = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const failedUrls: string[] = [];

    for (const url of urlList) {
      const success = await downloadImage(url);
      if (!success) failedUrls.push(url);
    }

    setFailed(failedUrls);
    setTaskCompleted(true);
  };

  const downloadFailedFile = (type: "txt" | "csv") => {
    if (!failed.length) return;
    const content =
      type === "txt" ? failed.join("\n") : "Failed URLs\n" + failed.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = type === "txt" ? "failed-urls.txt" : "failed-urls.csv";
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ---------- GRID LAYOUT ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------- MAIN CONTENT ---------- */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Multi Image Downloader
          </h1>
          <p className="text-gray-600 mb-6">
            Download multiple images at once using direct image links.
          </p>

          {/* ✅ Instructions Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Instructions
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Paste one or more image URLs in the text area below (one per line).</li>
              <li>Click <strong>Download Images</strong> to start downloading.</li>
              <li>Downloaded files will be saved with their original filenames.</li>
              <li>
                If some downloads fail, you can export the failed URLs as{" "}
                <code>.txt</code> or <code>.csv</code> for later use.
              </li>
              <li>
                <Link href="/blogs/how-to-download-multiple-images" className="text-blue-700 hover:underline">
                  Quick Guide: Download Multiple Images
                </Link>
              </li>
            </ul>
          </div>

          <textarea
            className="w-full border rounded-md p-3 mb-4 h-48 resize-none"
            placeholder="Enter image URLs, one per line..."
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
          />

          <button
            onClick={handleDownload}
            className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900"
          >
            Download Images
          </button>

          {taskCompleted && failed.length > 0 && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-semibold text-red-600 mb-2">
                Failed URLs
              </h2>
              <p className="text-gray-600 mb-3">
                Some images could not be downloaded. You can save the list below:
              </p>
              <button
                onClick={() => downloadFailedFile("txt")}
                className="bg-gray-700 text-white px-3 py-1 rounded mr-2 hover:bg-gray-800"
              >
                Save as TXT
              </button>
              <button
                onClick={() => downloadFailedFile("csv")}
                className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
              >
                Save as CSV
              </button>
            </div>
          )}

          {taskCompleted && failed.length === 0 && (
            <p className="mt-6 text-green-600 font-semibold">
              ✅ All images downloaded successfully!
            </p>
          )}
        </div>

        {/* ---------- RIGHT SIDEBAR ---------- */}
        <aside className="space-y-8">
          <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">📘 Related Blog Guides</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <Link href="/blogs/how-to-download-multiple-images" className="text-blue-700 hover:underline">
                  Quick Guide: Download Multiple Images
                </Link>
              </li>
              <li>
                <Link href="/blogs/how-to-optimize-and-convert-images-online-for-free" className="text-blue-700 hover:underline">
                  Optimize and Convert Images Online
                </Link>
              </li>
              <li>
                <Link href="/blogs/image-format" className="text-blue-700 hover:underline">
                  Learn About Image Formats
                </Link>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white border rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-3">🛠️ Try Other Tools</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <Link href="/tools/bulk-image-resize" className="text-blue-700 hover:underline">
                  📐 Bulk Image Resize
                </Link>
              </li>
              <li>
                <Link href="/tools/bulk-image-converter" className="text-blue-700 hover:underline">
                  🔄 Bulk Image Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/bulk-image-renamin" className="text-blue-700 hover:underline">
                  ✏️ Bulk Image Renaming
                </Link>
              </li>
              <li>
                <Link href="/tools/move-images-to-folders" className="text-blue-700 hover:underline">
                  📂 Move Images to Folders
                </Link>
              </li>
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
              Can I download images from any website?
            </h3>
            <p className="text-gray-600">
              You can download images from any public URL that directly links to
              an image file (ending in .jpg, .png, .gif, etc.). This tool doesn’t
              bypass site restrictions or protected content.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Where are the downloaded images saved?
            </h3>
            <p className="text-gray-600">
              All images are automatically saved to your computer’s default{" "}
              <strong>Downloads</strong> folder, with their original filenames.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              What if some images fail to download?
            </h3>
            <p className="text-gray-600">
              Failed image links will appear in a list. You can export them as a{" "}
              <code>.txt</code> or <code>.csv</code> file and retry later.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              Is this tool free to use?
            </h3>
            <p className="text-gray-600">
              Yes, Bulk Image Downloader is completely free to use with no
              registration required.
            </p>
          </div>
        </div>
      </section>

      {/* ⭐ Feedback popup */}
      <FeedbackPopup
        show={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={async ({ rating, message }) => {
          try {
            await fetch("/api/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                rating,
                message,
                page: "Multi Image Downloader",
                url: typeof window !== "undefined" ? window.location.href : "",
                userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
              }),
            });
          } catch (e) {
            console.error("Failed to submit feedback:", e);
          }
        }}
      />
    </div>
  );
}