import Link from "next/link";
export default function Tools() {
  return (
    <div>
      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">📚 Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <Link href="/blogs/how-to-optimize-and-convert-images-online-for-free">
            <h3 className="text-xl font-semibold mb-2">How to Optimize and Convert Images Online for Free</h3>
            <p className="text-gray-600">
              Optimize and Convert Images Online with Bulk IMG Tools
            </p>
            </Link>
            </div>          

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <Link href="/blogs/image-format">  
            <h3 className="text-xl font-semibold mb-2">Learn About Image Formats: JPG, PNG, GIF, AVIF & WebP</h3>
            <p className="text-gray-600">
              JPG is one of the most widely used image formats, perfect for photos and web images where small file size matters more than perfect quality.
           </p>
          </Link>  
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Link href="/blogs/how-to-download-multiple-images">
            <h3 className="text-xl font-semibold mb-2">Download Multiple Images</h3>
            <p className="text-gray-600">
              Download Multiple Images at once
            </p>
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Link href="/blogs/bulk-images-resize">
            <h3 className="text-xl font-semibold mb-2">Quick Guide: Bulk Images Resize</h3>
            <p className="text-gray-600">
              Resize Multiple Images at once
            </p>
            </Link>
          </div>{/* Feature 5 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            
          <Link href="/blogs/bulk-image-renamin">
            <h3 className="text-xl font-semibold mb-2">Quick Guide: Bulk Image Renaming</h3>
            <p className="text-gray-600">
              Rename Multiple Images at once
            </p>
            </Link>
          </div>
          {/* Feature 5 */}
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <Link href="/blogs/move-images-to-folders">
            <h3 className="text-xl font-semibold mb-2">Quick Guide: Bulk Image Renamer & Mover</h3>
            <p className="text-gray-600">
              Rename Multiple Images and move to sub folders at once
            </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}