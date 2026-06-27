"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type College = {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  description: string;
  placements: string;
  courses: string[];
  established: number;
  type: string;
};

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedA, setSelectedA] = useState<string>("");
  const [selectedB, setSelectedB] = useState<string>("");

  useEffect(() => {
    fetch("/api/colleges?limit=100")
      .then((r) => r.json())
      .then((data) => {
        const list: College[] = data.colleges || [];
        setColleges(list);
        if (list.length >= 2) {
          setSelectedA(list[0].id);
          setSelectedB(list[1].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const collegeA = colleges.find((c) => c.id === selectedA);
  const collegeB = colleges.find((c) => c.id === selectedB);

  // FIX: guard undefined values properly — String(undefined) was "undefined"
  function getVal(college: College | undefined, key: string): string {
    if (!college) return "—";
    const val = (college as unknown as Record<string, unknown>)[key];
    if (val === undefined || val === null || val === "") return "—";
    if (key === "fees" && typeof val === "number")
      return `₹${(val / 100000).toFixed(1)}L / yr`;
    return String(val);
  }

  type WinResult = "A" | "B" | "tie" | null;

  function winner(key: string): WinResult {
    if (!collegeA || !collegeB) return null;
    if (key === "rating") {
      if (collegeA.rating === collegeB.rating) return "tie";
      return collegeA.rating > collegeB.rating ? "A" : "B";
    }
    if (key === "fees") {
      if (collegeA.fees === collegeB.fees) return "tie";
      return collegeA.fees < collegeB.fees ? "A" : "B";
    }
    if (key === "placements") {
      const a = parseFloat(collegeA.placements);
      const b = parseFloat(collegeB.placements);
      // FIX: was silently returning null without checking both NaN
      if (!isNaN(a) && !isNaN(b)) {
        if (a === b) return "tie";
        return a > b ? "A" : "B";
      }
    }
    return null;
  }

  const rows = [
    { label: "Location",       key: "location",   icon: "📍", color: "violet" },
    { label: "Type",           key: "type",        icon: "🏛️", color: "sky"    },
    { label: "Established",    key: "established", icon: "📅", color: "amber"  },
    { label: "Annual Fees",    key: "fees",        icon: "💰", color: "rose"   },
    { label: "Rating",         key: "rating",      icon: "⭐", color: "yellow" },
    { label: "Avg. Placement", key: "placements",  icon: "💼", color: "green"  },
  ] as const;

  const scoreA = rows.filter((r) => winner(r.key) === "A").length;
  const scoreB = rows.filter((r) => winner(r.key) === "B").length;
  const overallWinner: "A" | "B" | "tie" | null =
    scoreA > scoreB ? "A" : scoreB > scoreA ? "B" :
    scoreA > 0 ? "tie" : null;

  // Unified, consistent palette — blue vs indigo throughout
  const paletteA = {
    border:   "border-blue-400",
    label:    "text-blue-600",
    badge:    "bg-blue-50 text-blue-700",
    winCell:  "bg-blue-50",
    winText:  "text-blue-700",
    winBadge: "bg-blue-100 text-blue-700",
    course:   "bg-blue-50 text-blue-700",
    header:   "bg-blue-600",
    dot:      "bg-blue-500",
    score:    "bg-blue-500",   // FIX: was violet-500 — inconsistent with palette
  };
  const paletteB = {
    border:   "border-indigo-400",
    label:    "text-indigo-600",
    badge:    "bg-indigo-50 text-indigo-700",
    winCell:  "bg-indigo-50",
    winText:  "text-indigo-700",
    winBadge: "bg-indigo-100 text-indigo-700",
    course:   "bg-indigo-50 text-indigo-700",
    header:   "bg-indigo-500",
    dot:      "bg-indigo-500",
    score:    "bg-indigo-500",  // FIX: was pink-500 — inconsistent with palette
  };

  const iconBg: Record<string, string> = {
    violet: "bg-violet-100",
    sky:    "bg-sky-100",
    amber:  "bg-amber-100",
    rose:   "bg-rose-100",
    yellow: "bg-yellow-100",
    green:  "bg-green-100",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Loading colleges from database…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-14 px-4 text-center">
        <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          Side-by-Side Analysis
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Compare Colleges
        </h1>
        <p className="text-blue-100 text-base max-w-lg mx-auto">
          {colleges.length} colleges loaded — pick any two for an instant breakdown.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Selectors ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-10">

          {/* College A */}
          <div className={`bg-white rounded-2xl border-2 ${paletteA.border} shadow-sm p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${paletteA.dot}`} />
              <p className={`text-xs font-extrabold uppercase tracking-widest ${paletteA.label}`}>
                College A
              </p>
            </div>
            <select
              value={selectedA}
              onChange={(e) => setSelectedA(e.target.value)}
              className="w-full text-gray-800 font-semibold text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            >
              {colleges.map((c) => (
                // FIX: disable option if it's already selected as B
                <option key={c.id} value={c.id} disabled={c.id === selectedB}>
                  {c.name}
                </option>
              ))}
            </select>
            {collegeA && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteA.badge}`}>⭐ {collegeA.rating}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteA.badge}`}>📍 {collegeA.location}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteA.badge}`}>{collegeA.type}</span>
              </div>
            )}
          </div>

          {/* VS — FIX: was hardcoded bg-blue-600, now neutral to sit between both columns */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-base">VS</span>
            </div>
          </div>

          {/* College B */}
          <div className={`bg-white rounded-2xl border-2 ${paletteB.border} shadow-sm p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${paletteB.dot}`} />
              <p className={`text-xs font-extrabold uppercase tracking-widest ${paletteB.label}`}>
                College B
              </p>
            </div>
            <select
              value={selectedB}
              onChange={(e) => setSelectedB(e.target.value)}
              className="w-full text-gray-800 font-semibold text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              {colleges.map((c) => (
                // FIX: disable option if it's already selected as A
                <option key={c.id} value={c.id} disabled={c.id === selectedA}>
                  {c.name}
                </option>
              ))}
            </select>
            {collegeB && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteB.badge}`}>⭐ {collegeB.rating}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteB.badge}`}>📍 {collegeB.location}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteB.badge}`}>{collegeB.type}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Score bar — FIX: was completely broken markup ──────── */}
        {(scoreA > 0 || scoreB > 0) && (
          <div className="flex items-center gap-3 mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <span className={`text-sm font-bold ${paletteA.label} w-28 text-right shrink-0 truncate`}>
              {collegeA?.name?.split(" ").slice(0, 2).join(" ")}
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${paletteA.score} transition-all duration-500 rounded-l-full`}
                style={{ width: `${(scoreA / rows.length) * 100}%` }}
              />
              <div
                className={`h-full ${paletteB.score} transition-all duration-500 rounded-r-full ml-auto`}
                style={{ width: `${(scoreB / rows.length) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${paletteB.label} w-28 shrink-0 truncate`}>
              {collegeB?.name?.split(" ").slice(0, 2).join(" ")}
            </span>
            <span className="text-xs font-bold text-gray-500 shrink-0 tabular-nums">
              {scoreA} – {scoreB}
            </span>
          </div>
        )}

        {/* ── Comparison Table ──────────────────────────────────── */}
        <div className="overflow-x-auto mb-6">
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden min-w-[560px]">

          {/* Header */}
          <div className="grid grid-cols-3 text-sm font-bold text-white">
            <div className="p-4 bg-gray-700 text-gray-300 text-xs uppercase tracking-wider">Criteria</div>
            <div className={`p-4 text-center ${paletteA.header}`}>
              {collegeA?.name || "College A"}
            </div>
            <div className={`p-4 text-center ${paletteB.header}`}>
              {collegeB?.name || "College B"}
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => {
            const w = winner(row.key);
            return (
              <div
                key={row.key}
                className={`grid grid-cols-3 border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
              >
                {/* Label */}
                <div className="p-4 flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${iconBg[row.color]}`}>
                    {row.icon}
                  </span>
                  <span className="text-gray-600 text-sm font-medium">{row.label}</span>
                </div>

                {/* College A value */}
                <div className={`p-4 border-l border-gray-100 flex flex-col items-center justify-center gap-1 ${w === "A" ? paletteA.winCell : ""}`}>
                  {w === "A" && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${paletteA.winBadge}`}>
                      ✓ BETTER
                    </span>
                  )}
                  {w === "tie" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      = TIE
                    </span>
                  )}
                  <span className={`text-sm font-semibold ${w === "A" ? paletteA.winText : "text-gray-700"}`}>
                    {getVal(collegeA, row.key)}
                  </span>
                </div>

                {/* College B value */}
                <div className={`p-4 border-l border-gray-100 flex flex-col items-center justify-center gap-1 ${w === "B" ? paletteB.winCell : ""}`}>
                  {w === "B" && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${paletteB.winBadge}`}>
                      ✓ BETTER
                    </span>
                  )}
                  {w === "tie" && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      = TIE
                    </span>
                  )}
                  <span className={`text-sm font-semibold ${w === "B" ? paletteB.winText : "text-gray-700"}`}>
                    {getVal(collegeB, row.key)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Courses — FIX: guard against missing courses array */}
          <div className="grid grid-cols-3 border-t border-gray-100 bg-white">
            <div className="p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-base flex-shrink-0">📚</span>
              <span className="text-gray-600 text-sm font-medium">Courses</span>
            </div>
            <div className="p-4 border-l border-gray-100 flex flex-wrap gap-1.5 justify-center">
              {(collegeA?.courses ?? []).map((c) => (
                <span key={c} className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteA.course}`}>{c}</span>
              ))}
              {!collegeA?.courses?.length && <span className="text-sm text-gray-400">—</span>}
            </div>
            <div className="p-4 border-l border-gray-100 flex flex-wrap gap-1.5 justify-center">
              {(collegeB?.courses ?? []).map((c) => (
                <span key={c} className={`text-xs font-medium px-2.5 py-1 rounded-full ${paletteB.course}`}>{c}</span>
              ))}
              {!collegeB?.courses?.length && <span className="text-sm text-gray-400">—</span>}
            </div>
          </div>

          {/* About */}
          <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/60">
            <div className="p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-base flex-shrink-0">📝</span>
              <span className="text-gray-600 text-sm font-medium">About</span>
            </div>
            <div className="p-4 border-l border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed text-center">{collegeA?.description || "—"}</p>
            </div>
            <div className="p-4 border-l border-gray-100">
              <p className="text-xs text-gray-500 leading-relaxed text-center">{collegeB?.description || "—"}</p>
            </div>
          </div>
        </div>

        </div>{/* end overflow-x-auto */}

        {/* ── Verdict ───────────────────────────────────────────── */}
        {overallWinner && (
          <div className={`rounded-2xl border p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 ${
            overallWinner === "tie"
              ? "bg-amber-50 border-amber-200"
              : overallWinner === "A"
              ? "bg-blue-50 border-blue-200"
              : "bg-indigo-50 border-indigo-200"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm ${
                overallWinner === "tie"
                  ? "bg-amber-400 text-white"
                  : overallWinner === "A"
                  ? "bg-blue-600 text-white"
                  : "bg-indigo-500 text-white"
              }`}>
                {overallWinner === "tie" ? "=" : "🏆"}
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${
                  overallWinner === "tie" ? "text-amber-600"
                  : overallWinner === "A" ? paletteA.label : paletteB.label
                }`}>
                  Overall Verdict
                </p>
                {overallWinner === "tie" ? (
                  <p className="text-gray-800 font-bold text-lg">It&apos;s a tie — both are evenly matched!</p>
                ) : (
                  <p className="text-gray-800 font-bold text-lg">
                    {overallWinner === "A" ? collegeA?.name : collegeB?.name} wins{" "}
                    <span className={overallWinner === "A" ? paletteA.label : paletteB.label}>
                      {overallWinner === "A" ? scoreA : scoreB}/{rows.length}
                    </span>{" "}
                    categories
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-0.5">Based on fees, rating &amp; placement performance</p>
              </div>
            </div>
            {overallWinner !== "tie" && (
              <Link
                href={`/colleges/${overallWinner === "A" ? collegeA?.id : collegeB?.id}`}
                className={`text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm whitespace-nowrap ${
                  overallWinner === "A"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                View College →
              </Link>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mr-1" />
            Blue = College A wins &nbsp;·&nbsp;
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1" />
            Indigo = College B wins
          </p>
          <Link href="/colleges" className="text-blue-600 text-sm font-semibold hover:underline">
            Browse all colleges →
          </Link>
        </div>

      </div>
    </div>
  );
}