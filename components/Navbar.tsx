"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, logoutUser, type User } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🎓 CollegeDiscover
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/colleges" className="text-gray-600 hover:text-blue-600 transition">Colleges</Link>
          <Link href="/compare" className="text-gray-600 hover:text-blue-600 transition">Compare</Link>
          {user ? (
            <>
              <Link href="/saved" className="text-gray-600 hover:text-blue-600 transition">Saved</Link>
              <span className="text-gray-500">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">Login</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger button - mobile only */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4 text-sm font-medium shadow-lg">
          <Link href="/colleges" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Colleges</Link>
          <Link href="/compare" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Compare</Link>
          {user ? (
            <>
              <Link href="/saved" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Saved</Link>
              <span className="text-gray-500">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}