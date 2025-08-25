'use client';
import { useEffect, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string; // signup email (read-only)
  company: string;
  address: string;
  mobile: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    address: "",
    mobile: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const storedProfile = localStorage.getItem("userProfile");

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setProfile((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));
    }
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("userProfile", JSON.stringify(profile));

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      user.firstName = profile.firstName;
      user.lastName = profile.lastName;
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    alert("Profile updated successfully ✅");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      alert("Please fill out both password fields");
      return;
    }

    // Get all users
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Find logged-in user
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      alert("No user is logged in.");
      return;
    }

    const currentUser: User = JSON.parse(loggedInUser);

    // Verify old password
    const userIndex = users.findIndex((u) => u.email === currentUser.email);
    if (userIndex === -1) {
      alert("User not found.");
      return;
    }

    if (users[userIndex].password !== oldPassword) {
      alert("Old password is incorrect ❌");
      return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    // Update loggedInUser too
    currentUser.password = newPassword;
    localStorage.setItem("loggedInUser", JSON.stringify(currentUser));

    alert("Password updated successfully 🔑");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>

      {/* Profile Info */}
      <form
        onSubmit={handleProfileSave}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
              }
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Email (read-only)</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="mt-1 block w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) =>
                setProfile({ ...profile, company: e.target.value })
              }
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input
              type="text"
              value={profile.mobile}
              onChange={(e) =>
                setProfile({ ...profile, mobile: e.target.value })
              }
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Profile
        </button>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handlePasswordChange}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border rounded-md p-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
