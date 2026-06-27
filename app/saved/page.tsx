"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUser, unsaveCollege } from "@/lib/auth";
import type { College } from "@/lib/colleges";
import Link from "next/link";

export default function SavedPage() {
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    fetch("/api/saved", { headers: { "x-user-id": user.id } })
      .then((r) => r.json())
      .then((data) => {
        setSavedColleges(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  async function handleRemove(id: string) {
    await unsaveCollege(id);
    setSavedColleges((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 bg-gray-200 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">♥ Saved Colleges</h1>
        <p className="text-gray-500 mb-8">{savedColleges.length} college{savedColleges.length !== 1 ? "s" : ""} saved</p>

        {savedColleges.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-semibold text-gray-700">No saved colleges yet</p>
            <p className="text-gray-500 mt-2">Browse colleges and click the heart button to save them here.</p>
            <Link
              href="/colleges"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              Explore Colleges →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {savedColleges.map((college) => (
              <div key={college.id} className="bg-white rounded-2xl shadow border p-5 flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-blue-700">{college.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">📍 {college.location}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="font-semibold">₹{(college.fees / 100000).toFixed(1)}L</p>
                      <p className="text-gray-400 text-xs">Fees/yr</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <p className="font-semibold text-yellow-700">⭐ {college.rating}</p>
                      <p className="text-gray-400 text-xs">Rating</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="font-semibold text-green-700">{college.placements}</p>
                      <p className="text-gray-400 text-xs">Avg. CTC</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/colleges/${college.id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700 transition"
                  >
                    View Details →
                  </Link>
                  <button
                    onClick={() => handleRemove(college.id)}
                    className="px-4 py-2 rounded-xl text-sm border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition"
                  >
                    Remove ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}