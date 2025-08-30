"use client";

import Image from "next/image";

export default function HowToDownloadMultipleImagesPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">
        Quick Guide: Bulk Images Resize
      </h1>

      {/* Step 1 */}
      <h2 className="text-2xl font-bold mb-3">Step 1: Go to the Website</h2>
      <p className="mb-4">
        Visit{" "}
        <a
          href="https://bulkimagetools.com/tools/bulk-image-resize"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Bulk Image Tools
        </a>
      </p>
      <Image
        src="/screenshots/bulk-images-resize/step1.png"
        alt="Bulk Image Tools homepage"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 2 */}
      <h2 className="text-2xl font-bold mb-3">Step 2: Click on ‘Browse Images‘ to select images you want to Resize</h2>
      <p className="mb-4">Collect image ending with .jpg, .png, .gif, etc.</p>
      <Image
        src="/screenshots/bulk-images-resize/step2.png"
        alt="Copying image links"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 3 */}
      <h2 className="text-2xl font-bold mb-3">Step 3: Select images and click on Open</h2>
      <p className="mb-4">Select images from your Local drive and click on Open button</p>
      <Image
        src="/screenshots/bulk-images-resize/step3.png"
        alt="Pasting URLs in Bulk Image Tools"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 4 */}
      <h2 className="text-2xl font-bold mb-3">Step 4: Click on Save to Folder</h2>
      <p className="mb-4">
        Click the <strong>Save to Folder</strong> button to save resize images and select folder.
      </p>
      <Image
        src="/screenshots/bulk-images-resize/step4.png"
        alt="Download button screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 5 */}
      <h2 className="text-2xl font-bold mb-3">Step 5: Click on View files button</h2>
      <Image
        src="/screenshots/bulk-images-resize/step5.png"
        alt="Downloaded images in folder"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 6 */}
      <h2 className="text-2xl font-bold mb-3">Step 6: add Width and Height</h2>
      <p className="mb-4">
        Fill the <b>‘Width’</b> and <b>‘Height’</b> with appropriate numbers, also you can select Units - <b>Pixels, Inches, CM, MM, Points, Picas</b>
      </p>
      <Image
        src="/screenshots/bulk-images-resize/step6.png"
        alt="Export failed links screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />
    </article>
  );
}