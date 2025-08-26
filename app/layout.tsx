import "./globals.css";
import { ReactNode } from "react";
import TopBar from "./components/TopBar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  description: "Convert, resize, rename, and download images in bulk",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        {/* 🔵 Navigation Bar */}
        <header className="bg-blue-300 shadow">
          <div className="container mx-auto flex items-center justify-between p-0.5">
            {/* ✅ Logo on Left */}
            <Link href="/" className="flex items-center space-x-1">
              <Image
                src="https://i.postimg.cc/0bZtyC3W/JDSymbol.png"
                alt="Bulk image tools logo"
                width={40}
                height={40}
                priority // 🚀 ensures fast load
              />
              <span className="text-black font-bold">Bulk Img Tool</span>
            </Link>
            <TopBar />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 container mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-blue-300 shadow text-left text-sm">
          <nav className="container mx-auto flex justify-between items-center p-4" />
          © {new Date().getFullYear()} Bulk img tools. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
