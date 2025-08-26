"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TopBar() {
  const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/"; // redirect to home
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <span className="font-semibold">Hello, {user.firstName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}