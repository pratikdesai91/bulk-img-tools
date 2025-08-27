import { Metadata } from "next";
import Welcome from "./Welcome";

export const metadata: Metadata = {
  title: "Welcome | YourApp",
  description: "Welcome page for logged-in users of YourApp.",
};

export default function WelcomePage() {
  return <Welcome />;
}