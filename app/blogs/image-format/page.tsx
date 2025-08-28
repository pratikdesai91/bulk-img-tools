"use client";

import Link from "next/link";

const blogPosts = [
  {
    title: "📸 What is JPG (JPEG) Format?",
    excerpt:
      "JPG is one of the most widely used image formats, perfect for photos and web images where small file size matters more than perfect quality.",
    slug: "jpg-format",
    content: (
      <>
        <p className="mb-3">
          The <b>JPG (or JPEG)</b> format uses lossy compression to reduce file
          sizes, making it one of the most popular formats on the internet. It’s
          best for photographs and images with gradients.
        </p>
        <ul className="list-disc ml-6 mb-3">
          <li>✅ Smaller file sizes, great for the web</li>
          <li>✅ Widely supported across all platforms</li>
          <li>⚠️ Loses some quality with each save</li>
        </ul>
        <p>
          Want to convert your images to JPG? Try our{" "}
          <Link
            href="https://bulkimagetools.com/tools/bulk-image-converter"
            className="text-blue-600 font-medium underline"
          >
            Free Bulk Image Converter
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "🖼️ PNG Format Explained",
    excerpt:
      "PNG is a lossless image format best for graphics, logos, and transparent images.",
    slug: "png-format",
    content: (
      <>
        <p className="mb-3">
          <b>PNG</b> uses lossless compression, meaning no quality is lost even
          after multiple saves. It also supports transparency, which makes it
          perfect for logos, icons, and images with sharp edges.
        </p>
        <ul className="list-disc ml-6 mb-3">
          <li>✅ Supports transparency</li>
          <li>✅ Lossless quality</li>
          <li>⚠️ Larger file size compared to JPG</li>
        </ul>
        <p>
          Need to convert to PNG? Use our{" "}
          <Link
            href="https://bulkimagetools.com/tools/bulk-image-converter"
            className="text-blue-600 font-medium underline"
          >
            Free Online Converter
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "🎞️ GIF Format — More than Memes",
    excerpt:
      "GIF is famous for animations, but it also supports transparency and simple graphics.",
    slug: "gif-format",
    content: (
      <>
        <p className="mb-3">
          The <b>GIF</b> format is limited to 256 colors but supports simple
          animations and transparency. It’s not great for photos but works well
          for icons, banners, and memes.
        </p>
        <ul className="list-disc ml-6 mb-3">
          <li>✅ Supports simple animations</li>
          <li>✅ Transparency supported</li>
          <li>⚠️ Limited color range (256 colors)</li>
        </ul>
        <p>
          Want to turn your files into GIFs? Try our{" "}
          <Link
            href="https://bulkimagetools.com/tools/bulk-image-converter"
            className="text-blue-600 font-medium underline"
          >
            Bulk Image Converter
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "🚀 AVIF — The Next-Gen Image Format",
    excerpt:
      "AVIF is a modern format that provides high-quality images with smaller file sizes than JPG or PNG.",
    slug: "avif-format",
    content: (
      <>
        <p className="mb-3">
          <b>AVIF</b> is based on the AV1 video codec. It offers incredible
          compression, reducing file size while maintaining high visual quality.
          It’s becoming the preferred choice for web performance optimization.
        </p>
        <ul className="list-disc ml-6 mb-3">
          <li>✅ Smaller file size than JPG/PNG</li>
          <li>✅ Supports HDR, transparency & animation</li>
          <li>⚠️ Limited support in older browsers</li>
        </ul>
        <p>
          Convert your images to AVIF easily with our{" "}
          <Link
            href="https://bulkimagetools.com/tools/bulk-image-converter"
            className="text-blue-600 font-medium underline"
          >
            Free Bulk Converter
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "🌐 WebP Format — Google’s Image Standard",
    excerpt:
      "WebP is widely supported and offers excellent compression while keeping images sharp.",
    slug: "webp-format",
    content: (
      <>
        <p className="mb-3">
          <b>WebP</b> is a modern image format developed by Google. It combines
          the best of both JPG and PNG: small file sizes, transparency, and even
          animations.
        </p>
        <ul className="list-disc ml-6 mb-3">
          <li>✅ Better compression than JPG</li>
          <li>✅ Transparency like PNG</li>
          <li>✅ Can support animation like GIF</li>
        </ul>
        <p>
          Convert your images into WebP with our{" "}
          <Link
            href="https://bulkimagetools.com/tools/bulk-image-converter"
            className="text-blue-600 font-medium underline"
          >
            Online Converter Tool
          </Link>
          .
        </p>
      </>
    ),
  },
];

const tools = [
  {
    name: "Free Online Bulk Images Converter",
    link: "https://bulkimagetools.com/tools/bulk-image-converter",
  },
  {
    name: "Free Online Bulk Images Downloader",
    link: "https://bulkimagetools.com/tools/bulk-image-download",
  },
  {
    name: "Free Online Bulk Images Resize",
    link: "https://bulkimagetools.com/tools/bulk-image-resize",
  },
  {
    name: "Free Online Bulk Images Renaming",
    link: "https://bulkimagetools.com/tools/bulk-image-renamin",
  },
  {
    name: "Free Online Bulk Images Mover to Folders",
    link: "https://bulkimagetools.com/tools/move-images-to-folders",
  },
];

export default function BlogSection() {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Blog Posts */}
      <div className="md:col-span-3">
        <h2 className="text-3xl font-bold mb-8">
          📚 Image Format Guides — JPG, PNG, WebP, GIF & AVIF Explained
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, i) => (
            <div
              key={i}
              className="border rounded-lg p-5 shadow hover:shadow-md transition bg-white"
            >
              <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
              <details className="cursor-pointer">
                <summary className="text-blue-600 font-medium">
                  Read more →
                </summary>
                <div className="mt-3 text-gray-700 text-sm">
                  {post.content}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="md:col-span-1 border-l pl-6">
        <h3 className="text-xl font-semibold mb-4">🛠️ Our Tools</h3>
        <ul className="space-y-3">
          {tools.map((tool, i) => (
            <li key={i}>
              <Link
                href={tool.link}
                className="text-blue-600 hover:underline text-sm"
              >
                {tool.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}