'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  firstName: string;
  lastName: string;
  [key: string]: unknown; // optional if user may have extra fields
}

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
        router.push('/login'); // fallback if parsing fails
      }
    } else {
      router.push('/login'); // redirect if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>
        Welcome, {user.firstName} {user.lastName}!
      </h1>
      <p>You have successfully logged in.</p>
      <button
        onClick={handleLogout}
        style={{
          padding: 10,
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          marginTop: 20,
        }}
      >
        Logout
      </button>
    </div>
  );
}