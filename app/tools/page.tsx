import Link from "next/link";
export default function Tools() {
  return (
    <div>
      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">What You Can Do With Our Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <Link href="/tools/bulk-image-download">
            <h3 className="text-xl font-semibold mb-2">📥 Bulk Image Download</h3>
            <p className="text-gray-600">
              Download multiple images at once using direct image links. Save time and boost productivity.
            </p>
            </Link>
            </div>          

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <Link href="/tools/bulk-image-resize">  
            <h3 className="text-xl font-semibold mb-2">📐 Bulk Image Resize</h3>
            <p className="text-gray-600">
              Quickly resize hundreds of images to the exact dimensions you need — in just one click.
            </p>
          </Link>  
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Link href="/tools/bulk-image-renamin">
            <h3 className="text-xl font-semibold mb-2">✏️ Bulk Image Renaming</h3>
            <p className="text-gray-600">
              Organize your files better with automatic batch renaming options.
            </p>
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Link href="/tools/move-images-to-folders">
            <h3 className="text-xl font-semibold mb-2">📂 Move Images to Folders</h3>
            <p className="text-gray-600">
              Sort and move bulk images into folders instantly for better project organization.
            </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}