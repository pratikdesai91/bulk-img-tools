"use client";

import Image from "next/image";

export default function HowToDownloadMultipleImagesPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">
        Quick Guide: Download Multiple Images
      </h1>

      {/* Step 1 */}
      <h2 className="text-2xl font-bold mb-3">Step 1: Go to the Website</h2>
      <p className="mb-4">
        Visit{" "}
        <a
          href="https://bulkimagetools.com/tools/bulk-image-download"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Bulk Image Tools
        </a>
      </p>
      <Image
        src="/screenshots/step1.jpg"
        alt="Bulk Image Tools homepage"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 2 */}
      <h2 className="text-2xl font-bold mb-3">Step 2: Copy Image Links</h2>
      <p className="mb-4">Collect direct image URLs ending with .jpg, .png, .gif, etc.</p>
      <pre className="bg-gray-900 text-white p-4 rounded-md text-left max-w-xl mx-auto mb-4">
        https://example.com/photo1.jpg{"\n"}
        https://example.com/photo2.png
      </pre>
      <Image
        src="/screenshots/step2.png"
        alt="Copying image links"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 3 */}
      <h2 className="text-2xl font-bold mb-3">Step 3: Paste Links</h2>
      <p className="mb-4">Paste the URLs into the input box on the site.</p>
      <Image
        src="/screenshots/step3.png"
        alt="Pasting URLs in Bulk Image Tools"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 4 */}
      <h2 className="text-2xl font-bold mb-3">Step 4: Download Images</h2>
      <p className="mb-4">
        Click the <strong>Download Images</strong> button.
      </p>
      <Image
        src="/screenshots/step4.png"
        alt="Download button screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 5 */}
      <h2 className="text-2xl font-bold mb-3">Step 5: Find Your Files</h2>
      <p className="mb-4">All images will appear in your Downloads folder.</p>
      <Image
        src="/screenshots/step5.png"
        alt="Downloaded images in folder"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 6 */}
      <h2 className="text-2xl font-bold mb-3">Step 6: Export Failed Links (Optional)</h2>
      <p className="mb-4">
        If any images fail, you can export the failed URLs as{" "}
        <code>.csv</code> or <code>.txt</code> for retry later.
      </p>
      <Image
        src="/screenshots/step6.png"
        alt="Export failed links screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />
    </article>
  );
}