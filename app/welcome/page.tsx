import type { Metadata } from "next";
import Welcome from "./Welcome";

// ✅ SEO metadata must stay here (server component)
export const metadata: Metadata = {
  title: "Welcome | MyApp",
  description: "Welcome page for users who have successfully logged in to MyApp.",
  keywords: ["welcome", "login success", "user dashboard", "MyApp"],
  openGraph: {
    title: "Welcome | MyApp",
    description: "Welcome page for users who have successfully logged in.",
    url: "https://yourdomain.com/welcome",
    siteName: "MyApp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome | MyApp",
    description: "Welcome page for users who have successfully logged in.",
  },
};

export default function WelcomePage() {
  return <Welcome />;
}