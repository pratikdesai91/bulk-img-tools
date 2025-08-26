"use client";
import { useState } from "react";

export default function SignupPage() {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      localStorage.setItem(
        "tempUser",
        JSON.stringify({ firstName, lastName, email, password })
      );
      setStep("verify");
    } else {
      alert("Failed to send OTP");
    }
  };

const handleVerify = async (e: React.FormEvent) => {
  e.preventDefault();

  const stored = localStorage.getItem("tempUser");
  if (!stored) return alert("No signup info found!");

  const { firstName, lastName, password } = JSON.parse(stored);

  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, firstName, lastName, password }),
  });

  const data = await res.json();

  if (res.ok) {
    alert("Signup successful!");
    localStorage.removeItem("tempUser");
    window.location.href = "/login";
  } else {
    alert(data.error);
  }
};

  return (
    <div className="max-w-md mx-auto mt-10">
      {step === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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