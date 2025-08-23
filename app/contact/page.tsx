import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Power Tools Store",
  description:
    "Get in touch with Power Tools Store for inquiries, support, or feedback about our bulk image tools. We're here to help you manage images efficiently.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <p className="text-gray-700 mb-4 leading-relaxed">
        Have questions or need assistance? Reach out to our support team and we&apos;ll help you get the most out of our bulk image management tools.
      </p>

      <ul className="text-gray-700 space-y-2">
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@powertoolsstore.com" className="text-blue-600 hover:underline">
            desai.pratik@jdinfra.org
          </a>
        </li>
        <li>
          <strong>Phone:</strong> +91 (972) 468-5514
        </li>
        <li>
          <strong>Address:</strong> 4/3851,
          Mumbaivad, Begampura,
          Surat - 395003, Gujarat, India
        </li>
      </ul>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Send us a message</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border rounded px-3 py-2"
          />
          <textarea
            placeholder="Your Message"
            className="border rounded px-3 py-2 h-32"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}