import "./globals.css";
import { ReactNode } from "react";
import TopBar from "./components/TopBar";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Bulk Image Tools",
  description: "Buy the best power tools online",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* 🔵 Navigation Bar */}
        <header className="bg-blue-300 shadow">
          <div className="container mx-auto flex items-center justify-between p-0.5">
            {/* ✅ Logo on Left */}
            <Link href="/" className="flex items-center space-x-1">
              <Image
                src="https://i.ibb.co/20SXtctw/bulk-img-tools.png"
                alt="bulk image tools logo"
                width={40}
                height={40}
              /><span className="text-black font-bold">Bulk Img Tool</span>
            </Link>
            <TopBar />
            
          </div>
        </header>

        {/* Page content */}
        <main className="container mx-auto p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-blue-300 shadow text-left text-sm">
                    <nav className="container mx-auto flex justify-between items-center p-4"></nav>
          © {new Date().getFullYear()} Bulk img tools. All rights reserved.
        </footer>
      </body>
    </html>
    
  );
}
