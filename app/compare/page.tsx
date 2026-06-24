"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { colleges } from "@/lib/colleges";
import type { College } from "@/lib/colleges";

export default function ComparePage() {
  const [selectedA, setSelectedA] = useState<string>("dtu");
  const [selectedB, setSelectedB] = useState<string>("nsut");

  const collegeA = colleges.find((c) => c.id === selectedA);
  const collegeB = colleges.find((c) => c.id === selectedB);

  const rows = [
    { label: "📍 Location", key: "location" },
    { label: "🏛️ Type", key: "type" },
    { label: "📅 Established", key: "established" },
    { label: "💰 Fees/Year", key: "fees", format: (v: number) => `₹${(v / 100000).toFixed(1)}L` },
    { label: "⭐ Rating", key: "rating" },
    { label: "💼 Avg. Placement", key: "placements" },
  ] as const;

  function getVal(college: College | undefined, key: string) {
    if (!college) return "—";
    const val = (college as unknown as Record<string, unknown>)[key];
    if (key === "fees" && typeof val === "number") return `₹${(val / 100000).toFixed(1)}L`;
    return String(val);
  }

  function highlight(college: College | undefined, key: string, other: College | undefined): string {
    if (!college || !other) return "";
    if (key === "rating" || key === "placements") {
      const a = parseFloat(String((college as unknown as Record<string, unknown>)[key]));
      const b = parseFloat(String((other as unknown as Record<string, unknown>)[key]));
      if (!isNaN(a) && !isNaN(b)) return a > b ? "bg-green-50 text-green-700 font-semibold" : "";
    }
    if (key === "fees") {
      const a = college.fees;
      const b = other.fees;
      return a < b ? "bg-green-50 text-green-700 font-semibold" : "";
    }
    return "";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">⚖️ Compare Colleges</h1>
        <p className="text-gray-500 mb-8">Select two colleges to compare them side by side.</p>

        {/* Selectors */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[
            { value: selectedA, onChange: setSelectedA, label: "College A" },
            { value: selectedB, onChange: setSelectedB, label: "College B" },
          ].map(({ value, onChange, label }) => (
            <div key={label}>
              <label className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 text-left w-1/3">Feature</th>
                <th className="p-4 text-center">{collegeA?.name || "College A"}</th>
                <th className="p-4 text-center">{collegeB?.name || "College B"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-4 font-medium text-gray-600">{row.label}</td>
                  <td className={`p-4 text-center rounded-sm ${highlight(collegeA, row.key, collegeB)}`}>
                    {getVal(collegeA, row.key)}
                  </td>
                  <td className={`p-4 text-center rounded-sm ${highlight(collegeB, row.key, collegeA)}`}>
                    {getVal(collegeB, row.key)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="p-4 font-medium text-gray-600">📚 Courses</td>
                <td className="p-4 text-center text-xs text-gray-600">{collegeA?.courses.join(", ")}</td>
                <td className="p-4 text-center text-xs text-gray-600">{collegeB?.courses.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          🟢 Green highlight = better value in that category
        </p>
      </div>
    </div>
  );
}
