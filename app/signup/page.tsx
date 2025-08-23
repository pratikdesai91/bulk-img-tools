"use client";
import { useState } from "react";

export default function SignupPage() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // call API to send OTP
    const res = await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // store user data temporarily
      localStorage.setItem(
        "tempUser",
        JSON.stringify({ fullName, email, password })
      );
      setStep("verify"); // move to OTP step
    } else {
      alert("Failed to send OTP");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const stored = localStorage.getItem("tempUser");
      if (stored) {
        const user = JSON.parse(stored);

        // save permanently
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.removeItem("tempUser");

        alert("Signup successful!");
        window.location.href = "/login"; // redirect
      }
    } else {
      alert("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {step === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Send OTP
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button className="w-full bg-green-500 text-white p-2 rounded">
            Verify & Signup
          </button>
        </form>
      )}
    </div>
  );
}