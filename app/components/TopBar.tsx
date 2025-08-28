'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  firstName: string;
  lastName: string;
  email?: string;
}

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const loadUser = () => {
      const loggedInUser = localStorage.getItem("loggedInUser");
      setUser(loggedInUser ? (JSON.parse(loggedInUser) as User) : null);
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="bg-blue-300 text-gray-900 shadow">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Left side links */}
        <div className="flex space-x-6">
          <Link href="/" className="text-lg font-medium hover:text-blue-900">Home</Link>
          <Link href="/tools/bulk-image-converter" className="text-lg font-medium hover:text-blue-900">Converter</Link>
          <Link href="/tools" className="text-lg font-medium hover:text-blue-900">Tools</Link>
          <Link href="/aboutus" className="text-lg font-medium hover:text-blue-900">About us</Link>
          <Link href="/blogs" className="text-lg font-medium hover:text-blue-900">Blogs</Link>
          <Link href="/contact" className="text-lg font-medium hover:text-blue-900">Contact Us</Link>
        </div>
        
        {/* Right side: auth */}
        <div className="flex items-center space-x-4 relative">
          {!user ? (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800"
              >
                Sign In
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* User name button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800"
              >
                {user.firstName} {user.lastName}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    {user.email && <p className="text-sm text-gray-600">{user.email}</p>}
                  </div>

                  {/* Profile option */}
                  <Link
                    href="/components/profilepage"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-gray-100 rounded-b-lg"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}