"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CollegeCard from "@/components/CollegeCard";
import SkeletonCard from "@/components/SkeletonCard";
import { getSaved } from "@/lib/auth";
import type { College } from "@/lib/colleges";

const LOCATIONS = ["All", "Delhi", "Mumbai", "Chennai", "Bangalore", "Pune", "Kolkata", "Pilani, Rajasthan", "Vellore, Tamil Nadu"];

export default function CollegesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState(9999999);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const [colleges, setColleges] = useState<College[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Load saved
  useEffect(() => {
    setSaved(getSaved());
  }, []);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (location && location !== "All") params.set("location", location);
    if (maxFees < 9999999) params.set("maxFees", String(maxFees));
    if (minRating > 0) params.set("rating", String(minRating));
    params.set("page", String(page));

    const res = await fetch(`/api/colleges?${params.toString()}`);
    const data = await res.json();
    setColleges(data.colleges);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setLoading(false);
  }, [debouncedSearch, location, maxFees, minRating, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">🎓 Explore Colleges</h1>
        <p className="text-gray-500 mb-6">{total} colleges found</p>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search colleges by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 pl-12 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8 grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">📍 Location</label>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l === "All" ? "" : l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              💰 Max Fees: {maxFees === 9999999 ? "Any" : `₹${(maxFees / 100000).toFixed(0)}L`}
            </label>
            <input
              type="range"
              min={50000}
              max={600000}
              step={50000}
              value={maxFees === 9999999 ? 600000 : maxFees}
              onChange={(e) => { setMaxFees(Number(e.target.value) >= 600000 ? 9999999 : Number(e.target.value)); setPage(1); }}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹50K</span><span>Any</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">⭐ Min Rating: {minRating || "Any"}</label>
            <div className="flex gap-2 flex-wrap">
              {[0, 4.0, 4.3, 4.5, 4.7].map((r) => (
                <button
                  key={r}
                  onClick={() => { setMinRating(r); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                    minRating === r
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-gray-700">No Colleges Found</p>
            <p className="text-gray-500 mt-2">Try a different search term or adjust your filters.</p>
            <button
              onClick={() => { setSearch(""); setLocation(""); setMaxFees(9999999); setMinRating(0); setPage(1); }}
              className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {colleges.map((college, i) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  index={i}
                  isSaved={saved.includes(college.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg border text-sm font-semibold transition ${
                      page === i + 1 ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
