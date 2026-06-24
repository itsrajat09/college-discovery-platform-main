"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logoutUser, type User } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🎓 CollegeDiscover
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/colleges" className="text-gray-600 hover:text-blue-600 transition">
            Colleges
          </Link>
          <Link href="/compare" className="text-gray-600 hover:text-blue-600 transition">
            Compare
          </Link>
          {user ? (
            <>
              <Link href="/saved" className="text-gray-600 hover:text-blue-600 transition">
                Saved
              </Link>
              <span className="text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
