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
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Replace this with your real validation
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: User) => u.email === email && u.password === password
    );

    if (user) {
      // ✅ Store logged-in user
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // 🔄 Tell TopBar about login
      window.dispatchEvent(new Event("storage"));

      // ✅ Redirect user
      router.push("/tools"); // change to your route
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}