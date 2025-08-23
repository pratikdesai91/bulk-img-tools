'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Welcome() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
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
      <h1>Welcome, {user.firstName} {user.lastName}!</h1>
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout} style={{ padding: 10, backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}