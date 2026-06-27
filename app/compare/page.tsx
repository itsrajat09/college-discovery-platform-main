"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

type College = {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
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

  function getVal(college: College | undefined, key: string): string {
    if (!college) return "—";
    const val = (college as unknown as Record<string, unknown>)[key];
    if (key === "fees" && typeof val === "number") return `₹${(val / 100000).toFixed(1)}L`;
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  }

  function winner(key: string): "A" | "B" | null {
    if (!collegeA || !collegeB) return null;
    if (key === "rating") {
      return collegeA.rating > collegeB.rating ? "A" : collegeB.rating > collegeA.rating ? "B" : null;
    }
    if (key === "fees") return collegeA.fees < collegeB.fees ? "A" : collegeB.fees < collegeA.fees ? "B" : null;
    if (key === "placements") {
      const a = parseFloat(collegeA.placements);
      const b = parseFloat(collegeB.placements);
      if (!isNaN(a) && !isNaN(b)) return a > b ? "A" : b > a ? "B" : null;
    }
    return null;
  }

  const rows = [
    { label: "Location", key: "location", icon: "📍" },
    { label: "Type", key: "type", icon: "🏛️" },
    { label: "Established", key: "established", icon: "📅" },
    { label: "Annual Fees", key: "fees", icon: "💰" },
    { label: "Rating", key: "rating", icon: "⭐" },
    { label: "Avg. Placement", key: "placements", icon: "💼" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
        <Navbar />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚖️</div>
            <p style={{ fontSize: "16px" }}>Loading colleges from database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ textAlign: "center", padding: "48px 24px 32px" }}>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: "100px",
          padding: "6px 20px", color: "#a78bfa", fontSize: "13px", fontWeight: 600,
          letterSpacing: "0.05em", marginBottom: "16px", textTransform: "uppercase"
        }}>
          Side-by-Side Analysis
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Compare Colleges
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", margin: 0 }}>
          {colleges.length} colleges loaded from database • pick two to compare
        </p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 64px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "20px", padding: "24px" }}>
            <div style={{ color: "#a78bfa", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>College A</div>
            <select value={selectedA} onChange={(e) => setSelectedA(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer", outline: "none", appearance: "none" }}>
              {colleges.map((c) => <option key={c.id} value={c.id} style={{ background: "#302b63", color: "#fff" }}>{c.name}</option>)}
            </select>
            {collegeA && (
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", padding: "4px 10px", borderRadius: "100px", fontSize: "12px" }}>⭐ {collegeA.rating}</span>
                <span style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", padding: "4px 10px", borderRadius: "100px", fontSize: "12px" }}>📍 {collegeA.location}</span>
              </div>
            )}
          </div>

          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "14px", boxShadow: "0 0 30px rgba(139,92,246,0.5)", flexShrink: 0 }}>VS</div>

          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(236,72,153,0.4)", borderRadius: "20px", padding: "24px" }}>
            <div style={{ color: "#f9a8d4", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>College B</div>
            <select value={selectedB} onChange={(e) => setSelectedB(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 16px", color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer", outline: "none", appearance: "none" }}>
              {colleges.map((c) => <option key={c.id} value={c.id} style={{ background: "#302b63", color: "#fff" }}>{c.name}</option>)}
            </select>
            {collegeB && (
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ background: "rgba(236,72,153,0.2)", color: "#f9a8d4", padding: "4px 10px", borderRadius: "100px", fontSize: "12px" }}>⭐ {collegeB.rating}</span>
                <span style={{ background: "rgba(236,72,153,0.2)", color: "#f9a8d4", padding: "4px 10px", borderRadius: "100px", fontSize: "12px" }}>📍 {collegeB.location}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ padding: "18px 24px", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Feature</div>
            <div style={{ padding: "18px 24px", textAlign: "center", color: "#c4b5fd", fontSize: "14px", fontWeight: 700, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>{collegeA?.name || "College A"}</div>
            <div style={{ padding: "18px 24px", textAlign: "center", color: "#f9a8d4", fontSize: "14px", fontWeight: 700, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>{collegeB?.name || "College B"}</div>
          </div>

          {rows.map((row, i) => {
            const w = winner(row.key);
            return (
              <div key={row.key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "18px" }}>{row.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 500 }}>{row.label}</span>
                </div>
                <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", background: w === "A" ? "rgba(139,92,246,0.12)" : "transparent" }}>
                  <span style={{ color: w === "A" ? "#c4b5fd" : "rgba(255,255,255,0.75)", fontWeight: w === "A" ? 700 : 500, fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                    {w === "A" && <span>🏆</span>}{getVal(collegeA, row.key)}
                  </span>
                </div>
                <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", background: w === "B" ? "rgba(236,72,153,0.12)" : "transparent" }}>
                  <span style={{ color: w === "B" ? "#f9a8d4" : "rgba(255,255,255,0.75)", fontWeight: w === "B" ? 700 : 500, fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                    {w === "B" && <span>🏆</span>}{getVal(collegeB, row.key)}
                  </span>
                </div>
              </div>
            );
          })}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>📚</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 500 }}>Courses</span>
            </div>
            <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
              {collegeA?.courses.map((c) => <span key={c} style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 500 }}>{c}</span>)}
            </div>
            <div style={{ padding: "20px 24px", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
              {collegeB?.courses.map((c) => <span key={c} style={{ background: "rgba(236,72,153,0.2)", color: "#f9a8d4", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 500 }}>{c}</span>)}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
          🏆 Trophy = better value in that category
        </div>
      </div>
    </div>
  );
}