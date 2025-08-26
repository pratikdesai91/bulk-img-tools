'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: User) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
      router.push("/tools");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetLink("");

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === resetEmail);

    if (!user) {
      setError("Email not found");
      return;
    }

    // Fake token
    const token = btoa(`${user.email}-${Date.now()}`);
    const link = `${window.location.origin}/reset-password?token=${token}`;

    // Simulate email by just showing link
    setResetLink(link);
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      {!resetMode ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>
          <p
            onClick={() => setResetMode(true)}
            className="text-blue-600 mt-4 cursor-pointer hover:underline text-sm"
          >
            Forgot Password?
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <form onSubmit={handleSendResetLink} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Send Reset Link
            </button>
          </form>

          {resetLink && (
            <div className="mt-4 p-3 border rounded bg-gray-50 text-sm">
              <p className="font-semibold">📩 Simulated email sent:</p>
              <p>
                Click this link to reset your password:{" "}
                <a
                  href={resetLink}
                  className="text-blue-600 underline break-all"
                >
                  {resetLink}
                </a>
              </p>
            </div>
          )}

          <p
            onClick={() => setResetMode(false)}
            className="text-blue-600 mt-4 cursor-pointer hover:underline text-sm"
          >
            Back to Login
          </p>
        </>
      )}
    </div>
  );
}