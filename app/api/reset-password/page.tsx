'use client';
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Decode token (we encoded as base64: email + timestamp)
    let decodedEmail = "";
    try {
      const decoded = atob(token).split("-")[0]; // email-part
      decodedEmail = decoded;
    } catch {
      setError("Invalid reset token.");
      return;
    }

    const userIndex = users.findIndex((u) => u.email === decodedEmail);
    if (userIndex === -1) {
      setError("User not found.");
      return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess("Password reset successful! Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}