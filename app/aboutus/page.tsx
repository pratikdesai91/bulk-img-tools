export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>

      <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Welcome to <strong>Power Tools Store</strong> you are go to platform for
        powerful, easy-to-use image management tools. Whether you’re a
        photographer, designer, marketer or small business owner. We provide
        smart solutions that save you time and effort.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">💡 Our Mission</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Our mission is to make image management effortless. We understand how
        challenging it can be to handle large sets of images, so we built tools
        that allow you to:
      </p>
      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li>📥 Download bulk images using direct links</li>
        <li>📐 Resize multiple images at once with precision</li>
        <li>✏️ Rename hundreds of images in seconds</li>
        <li>📂 Organize and move images into folders instantly</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">🌍 Why Choose Us?</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Unlike generic tools, we focus specifically on bulk image operations.
        Our solutions are designed for speed, accuracy, and simplicity. With
        <strong> Power Tools Store</strong>, you spend less time managing files
        and more time creating.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">📞 Get in Touch</h2>
      <p className="text-gray-700 leading-relaxed">
        We love hearing from our users! If you have suggestions, feature
        requests, or just want to say hi, visit our{" "}
        <a
          href="/contact"
          className="text-blue-600 hover:underline font-medium"
        >
          Contact Us
        </a>{" "}
        page.
      </p>
    </div>
  );
}