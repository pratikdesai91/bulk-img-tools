"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-7 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to Bulk Img Tools</h1>
        <p className="text-lg text-gray-700">
          Smart tools to make your image workflow faster, easier, and more powerful.
        </p>
      </section>

      <section className="mt-16 text-center max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          <strong>Bulk Img Tools</strong> is your one-stop solution for managing
          large collections of images with ease. Whether you’re a designer,
          photographer, developer, or content creator, our free bulk image
          tools save hours of manual work by automating repetitive tasks. From
          downloading images in bulk to resizing, renaming, converting, and
          organizing them into folders we’ve built everything you need in one
          place.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mt-4">
          Unlike traditional software, Bulk Img Tools works directly in your
          browser. That means no installation, no heavy apps, and instant
          results. Our goal is simple: to help you improve workflow efficiency
          while maintaining image quality and flexibility.
        </p>
      </section>      

      {/* Features Carousel Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          What You Can Do With Our Tools
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="max-w-5xl mx-auto"
        >
          {/* Feature 1 */}
          <SwiperSlide>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <Link href="/tools/bulk-image-download">
                <h3 className="text-xl font-semibold mb-2">
                  📥 Bulk Image Download
                </h3>
                <p className="text-gray-600">
                  Download multiple images at once using direct image links. Save
                  time and boost productivity.
                </p>
              </Link>
            </div>
          </SwiperSlide>

          {/* Feature 2 */}
          <SwiperSlide>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <Link href="/tools/bulk-image-resize">
                <h3 className="text-xl font-semibold mb-2">
                  📐 Bulk Image Resize
                </h3>
                <p className="text-gray-600">
                  Quickly resize hundreds of images to the exact dimensions you
                  need — in just one click.
                </p>
              </Link>
            </div>
          </SwiperSlide>

          {/* Feature 3 */}
          <SwiperSlide>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <Link href="/tools/bulk-image-renamin">
                <h3 className="text-xl font-semibold mb-2">
                  ✏️ Bulk Image Renaming
                </h3>
                <p className="text-gray-600">
                  Organize your files better with automatic batch renaming
                  options.
                </p>
              </Link>
            </div>
          </SwiperSlide>

          {/* Feature 4 */}
          <SwiperSlide>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <Link href="/tools/move-images-to-folders">
                <h3 className="text-xl font-semibold mb-2">
                  📂 Move Images to Folders
                </h3>
                <p className="text-gray-600">
                  Sort and move bulk images into folders instantly for better
                  project organization.
                </p>
              </Link>
            </div>
          </SwiperSlide>

          {/* Feature 5 */}
          <SwiperSlide>
            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
              <Link href="/tools/bulk-image-converter">
                <h3 className="text-xl font-semibold mb-2">
                  🔄 Bulk Image Converter
                </h3>
                <p className="text-gray-600">
                  Convert multiple images to WebP, JPG, PNG, GIF, or AVIF — fast,
                  easy, and downloadable as a ZIP.
                </p>
              </Link>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
            {/* FAQ Section for SEO */}
      <section className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-blue-700">
              <b>1.</b> What is Bulk Img Tools used for?
            </h3>
            <p className="text-gray-700 mt-2">
              Bulk Img Tools helps you process multiple images at once. You can
              download, resize, rename, convert, and organize images without
              installing any software.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-700">
            <b>2.</b> Is Bulk Img Tools free to use?
            </h3>
            <p className="text-gray-700 mt-2">
              Yes! All of our tools are free to use directly from your browser.
              No registration or credit card required.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-700">
            <b>3.</b> Which formats can I convert images to?
            </h3>
            <p className="text-gray-700 mt-2">
              Our bulk converter supports JPG, PNG, GIF, WebP, and AVIF. You can
              quickly convert images and download them as a single ZIP file.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-700">
            <b>4.</b> Do I need to install any software?
            </h3>
            <p className="text-gray-700 mt-2">
              No, Bulk Img Tools works 100% online. All tools run directly in
              your browser for maximum speed and convenience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}