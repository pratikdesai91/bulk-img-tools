"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  firstName: string;
  lastName: string;
  [key: string]: unknown;
}

export default function Welcome() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      try {
        const parsedUser: User = JSON.parse(loggedInUser);
        setUser(parsedUser);
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="text-center mt-12">
      <h1 className="text-3xl font-bold">
        Welcome, {user.firstName} {user.lastName}!
      </h1>
      <p className="text-gray-600 mt-2">You have successfully logged in.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
}