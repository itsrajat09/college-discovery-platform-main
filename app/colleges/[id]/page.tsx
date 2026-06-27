"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { toggleSavedDB, fetchSavedIds, getUser } from "@/lib/auth";
import type { College } from "@/lib/colleges";
import Link from "next/link";

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/colleges/${id}`)
      .then((r) => r.json())
      .then(async (data) => {
        setCollege(data);
        const savedIds = await fetchSavedIds();
        setSaved(savedIds.includes(id));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!getUser()) { router.push("/login"); return; }
    const newState = await toggleSavedDB(id, saved);
    setSaved(newState);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-40 bg-gray-100 rounded mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
          </div>
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-xl font-semibold">College not found</p>
          <Link href="/colleges" className="mt-4 inline-block text-blue-600 hover:underline">← Back to Colleges</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/colleges" className="text-blue-600 text-sm hover:underline mb-4 inline-block">
          ← Back to Colleges
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">{college.name}</h1>
              <p className="text-gray-500 mt-1">📍 {college.location}</p>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">{college.type}</span>
                <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">Est. {college.established}</span>
              </div>
            </div>
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition ${
                saved
                  ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                  : "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              }`}
            >
              {saved ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow border p-5 text-center">
            <p className="text-2xl font-bold text-blue-600">₹{(college.fees / 100000).toFixed(1)}L</p>
            <p className="text-gray-500 text-sm mt-1">Fees per year</p>
          </div>
          <div className="bg-white rounded-2xl shadow border p-5 text-center">
            <p className="text-2xl font-bold text-yellow-500">⭐ {college.rating}</p>
            <p className="text-gray-500 text-sm mt-1">Overall Rating</p>
          </div>
          <div className="bg-white rounded-2xl shadow border p-5 text-center">
            <p className="text-2xl font-bold text-green-600">{college.placements}</p>
            <p className="text-gray-500 text-sm mt-1">Avg. CTC</p>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📖 Overview</h2>
          <p className="text-gray-600 leading-relaxed">{college.description}</p>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">📚 Courses Offered</h2>
          <div className="flex flex-wrap gap-2">
            {(college.courses || []).map((course) => (
              <span key={course} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                {course}
              </span>
            ))}
          </div>
        </div>

        {/* Placements */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💼 Placements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-green-700 font-bold text-xl">{college.placements}</p>
              <p className="text-green-600 text-sm">Average Package</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-700 font-bold text-xl">95%+</p>
              <p className="text-blue-600 text-sm">Placement Rate</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Top recruiters include companies like Google, Microsoft, Amazon, Flipkart, and other leading tech firms.
          </p>
        </div>

        {/* Compare CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Want to compare {college.name} with others?</h3>
          <p className="text-blue-100 text-sm mb-4">See how it stacks up against top colleges side by side.</p>
          <Link
            href="/compare"
            className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition"
          >
            Go to Compare →
          </Link>
        </div>
      </div>
    </div>
  );
}