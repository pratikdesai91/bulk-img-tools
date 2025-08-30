"use client";

import Image from "next/image";
import Link from "next/link";
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
          href="https://bulkimagetools.com/tools/move-images-to-folders"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Bulk Image Tools
        </a>
      </p>
      <Image
        src="/screenshots/move-images-to-folders/step1.png"
        alt="Bulk Image Tools homepage"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 2 */}
      <h2 className="text-2xl font-bold mb-3">Step 2: Click on <b>Download CSV</b> Template</h2>
      <p className="mb-4">Click on <b>‘Download CSV Template</b> and download the template <b>move-images-to-folders.csv. </b>
<b>Note : Template will be download in Download folder “bulk-image-renaming.csv”</b>
</p>
      <Image
        src="/screenshots/move-images-to-folders/step2.png"
        alt="Copying image links"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 3 */}
      <h2 className="text-2xl font-bold mb-3">Step 3: Open move-images-to-folders.csv.</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <article className="max-w-4xl mx-auto px-4 py-12 text-left">
              <li>Open move-images-to-folders.csv template.</li>
              <li>Fill the “Column-A original_name” with original file names “Column-B new_name” with new names and Column-C folder_name with folder names. <b>Make sure to add extension at the end (.jpg, .png, .AVIF etc)</b></li>
              <li><Link href="/blogs/how-to-download-multiple-images" className="text-blue-700 hover:underline">How to copy images name in excel?</Link></li>
              <li>Save move-images-to-folders.csv file and close file.</li>
              <pre className="bg-gray-900 text-white p-4 rounded-md text-left max-w-l mx-auto mb-4">
        original_name	  new_name     folder_name{"\n"}
        image1.jpg	    image-1.jpg	    test-1{"\n"}
        image2.jpg	    image-1.jpg	    test-2
      </pre></article>
            </ul>
      <Image
        src="/screenshots/move-images-to-folders/step3.png"
        alt="Pasting URLs in Bulk Image Tools"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 4 */}
      <h2 className="text-2xl font-bold mb-3">Step 4: Click on Upload CSV.</h2>
      <p className="mb-4">
        Click the <strong>Upload CSV</strong> button and browse the move-images-to-folders.csv file.
      </p>
      <Image
        src="/screenshots/move-images-to-folders/step4.png"
        alt="Download button screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 5 */}
      <h2 className="text-2xl font-bold mb-3">Step 5: Click on Browse Images button</h2>
      <p className="mb-4">
        Click on <b>Browse Images</b> button and select image you want to edit. <b>(Make sure must be same original_name column names and selected images names).</b></p>
      <Image
        src="/screenshots/move-images-to-folders/step5.png"
        alt="Downloaded images in folder"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />

      {/* Step 6 */}
      <h2 className="text-2xl font-bold mb-3">Step 6: Click on Choose Output Folder</h2>
      <p className="mb-4">
        Click on <b>Choose Output Folder </b>to save renamed images inside the sub folders
      </p>
      <Image
        src="/screenshots/move-images-to-folders/step6.png"
        alt="Export failed links screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />
            {/* Step 7 */}
      <h2 className="text-2xl font-bold mb-3">Step 7: Click on View files</h2>
      <Image
        src="/screenshots/move-images-to-folders/step7.png"
        alt="Export failed links screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />
            {/* Step 8 */}
      <h2 className="text-2xl font-bold mb-3">Step 8: Click Proceed button to start the process</h2>
      <Image
        src="/screenshots/move-images-to-folders/step8.png"
        alt="Export failed links screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />
            {/* Step 9 */}
      <h2 className="text-2xl font-bold mb-3">Step 9: Final result</h2>
      <Image
        src="/screenshots/move-images-to-folders/step9.png"
        alt="Export failed links screenshot"
        width={800}
        height={450}
        className="rounded shadow-md mx-auto mb-10"
      />
    </article>
  );
}