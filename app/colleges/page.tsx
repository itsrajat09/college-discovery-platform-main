"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CollegeCard from "@/components/CollegeCard";
import SkeletonCard from "@/components/SkeletonCard";
import { fetchSavedIds } from "@/lib/auth";
import type { College } from "@/lib/colleges";

const LOCATIONS = ["All", "Delhi", "Mumbai", "Chennai", "Bangalore", "Pune", "Kolkata", "Pilani, Rajasthan", "Vellore, Tamil Nadu"];

function CollegesContent() {
  const searchParams = useSearchParams();

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

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearch(q);
      setDebouncedSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;
  fetchSavedIds().then(setSaved);
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

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  const clearFilters = () => { setSearch(""); setDebouncedSearch(""); setLocation(""); setMaxFees(9999999); setMinRating(0); setPage(1); };

  const handleSearch = () => { setDebouncedSearch(search); setPage(1); };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <style>{`
        .colleges-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .filters-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) {
          .colleges-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
          .filters-grid { grid-template-columns: 1fr; gap: 18px; }
        }
        @media (max-width: 480px) {
          .colleges-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2060 50%, #1e4db7 100%)", padding: "40px 16px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ color: "#93c5fd", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Database • Live Results</p>
          <h1 style={{ fontSize: "clamp(1.7rem, 6vw, 3rem)", fontWeight: 900, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>🎓 Explore Colleges</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            {loading ? "Loading..." : <><span style={{ color: "#60a5fa", fontWeight: 700 }}>{total}</span> colleges found</>}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "-28px auto 0", padding: "0 16px 64px", position: "relative", zIndex: 10 }}>

        {/* Search Bar */}
        <div style={{ background: "#fff", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", padding: "6px 6px 6px 16px", boxShadow: "0 8px 32px rgba(30,77,183,0.15)", border: "1px solid rgba(59,130,246,0.15)", marginBottom: "14px" }}>
          <span style={{ fontSize: "18px", color: "#94a3b8", flexShrink: 0 }}>🔍</span>
          <input
            type="text"
            placeholder="Search colleges by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", color: "#0a1628", background: "transparent", minWidth: 0 }}
          />
          {search && (
            <button onClick={() => { setSearch(""); setDebouncedSearch(""); }} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "7px 12px", color: "#64748b", cursor: "pointer", fontSize: "13px", flexShrink: 0 }}>Clear</button>
          )}
          <button
            onClick={handleSearch}
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 20px", fontWeight: 700, fontSize: "14px", cursor: "pointer", flexShrink: 0 }}
          >Search</button>
        </div>

        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 4px 20px rgba(30,77,183,0.08)", border: "1px solid rgba(59,130,246,0.1)", marginBottom: "20px" }}>
          <div className="filters-grid">
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>📍 Location</label>
              <select value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", color: "#0a1628", background: "#f8fafc", outline: "none", cursor: "pointer" }}>
                {LOCATIONS.map((l) => <option key={l} value={l === "All" ? "" : l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                💰 Max Fees: <span style={{ color: "#3b82f6" }}>{maxFees === 9999999 ? "Any" : `₹${(maxFees / 100000).toFixed(0)}L`}</span>
              </label>
              <input type="range" min={50000} max={600000} step={50000} value={maxFees === 9999999 ? 600000 : maxFees}
                onChange={(e) => { setMaxFees(Number(e.target.value) >= 600000 ? 9999999 : Number(e.target.value)); setPage(1); }}
                style={{ width: "100%", accentColor: "#3b82f6" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                <span>₹50K</span><span>Any</span>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
                ⭐ Min Rating: <span style={{ color: "#3b82f6" }}>{minRating || "Any"}</span>
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[0, 4.0, 4.3, 4.5, 4.7].map((r) => (
                  <button key={r} onClick={() => { setMinRating(r); setPage(1); }} style={{
                    padding: "7px 13px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    border: minRating === r ? "none" : "1px solid #e2e8f0",
                    background: minRating === r ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#f8fafc",
                    color: minRating === r ? "#fff" : "#64748b",
                    boxShadow: minRating === r ? "0 4px 12px rgba(59,130,246,0.3)" : "none"
                  }}>{r === 0 ? "Any" : `${r}+`}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(search || location || maxFees < 9999999 || minRating > 0) && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ color: "#64748b", fontSize: "13px" }}>Active filters:</span>
            {search && <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>"{search}"</span>}
            {location && <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>📍 {location}</span>}
            {maxFees < 9999999 && <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>💰 ≤₹{(maxFees / 100000).toFixed(0)}L</span>}
            {minRating > 0 && <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>⭐ {minRating}+</span>}
            <button onClick={clearFilters} style={{ color: "#ef4444", fontSize: "12px", fontWeight: 600, background: "#fee2e2", border: "none", borderRadius: "100px", padding: "3px 10px", cursor: "pointer" }}>✕ Clear all</button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="colleges-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : colleges.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: "20px" }}>
            <p style={{ fontSize: "44px", marginBottom: "14px" }}>🔍</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#0a1628", marginBottom: "8px" }}>No Colleges Found</p>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>Try a different search term or adjust your filters.</p>
            <button onClick={clearFilters} style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", borderRadius: "12px", padding: "11px 24px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="colleges-grid">
              {colleges.map((college, i) => (
                <CollegeCard key={college.id} college={college} index={i} isSaved={saved.includes(college.id)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "36px", alignItems: "center", flexWrap: "wrap" }}>
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontWeight: 600, fontSize: "14px" }}>← Prev</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} style={{ width: "38px", height: "38px", borderRadius: "10px", border: page === i + 1 ? "none" : "1px solid #e2e8f0", background: page === i + 1 ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#fff", color: page === i + 1 ? "#fff" : "#64748b", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: page === i + 1 ? "0 4px 12px rgba(59,130,246,0.3)" : "none" }}>{i + 1}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontWeight: 600, fontSize: "14px" }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f0f4ff" }} />}>
      <CollegesContent />
    </Suspense>
  );
}