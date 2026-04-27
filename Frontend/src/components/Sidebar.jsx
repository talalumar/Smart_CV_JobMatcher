"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-64 bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        Dashboard
      </h2>

      <ul className="space-y-4">
        <li>Upload Resume</li>
        <li>Matched Jobs</li>
        <li>ATS Score</li>
        <li>Saved Jobs</li>
        <li>Profile</li>
      </ul>

      <button
        onClick={handleLogout}
        className="mt-10 bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}