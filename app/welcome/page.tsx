'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

interface User {
  firstName: string;
  lastName: string;
  [key: string]: unknown;
}

// ✅ SEO metadata
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

export default function Welcome() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      try {
        const parsedUser: User = JSON.parse(loggedInUser);
        setUser(parsedUser);
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {user.firstName} {user.lastName}!
      </h1>
      <p className="text-lg text-gray-700">You have successfully logged in.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Logout
      </button>
    </main>
  );
}