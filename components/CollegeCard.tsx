"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { toggleSavedDB, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { College } from "@/lib/colleges";

type Props = { college: College; index: number; isSaved?: boolean; };

export default function CollegeCard({ college, index, isSaved = false }: Props) {
  const [saved, setSaved] = useState(isSaved);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

async function handleSave(e: React.MouseEvent) {
  e.preventDefault();
  if (!getUser()) { router.push("/login"); return; }
  setSaved(!saved); // pehle UI turant update karo
  const newState = await toggleSavedDB(college.id, saved);
  setSaved(newState); // DB response se confirm karo
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: "20px",
        border: hovered ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(59,130,246,0.1)",
        boxShadow: hovered ? "0 16px 40px rgba(30,77,183,0.18)" : "0 4px 20px rgba(30,77,183,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease", overflow: "hidden", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ height: "4px", background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />

      <Link href={`/colleges/${college.id}`} style={{ textDecoration: "none", padding: "20px 20px 16px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div style={{ flex: 1, marginRight: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#1e3a8a", margin: "0 0 5px", lineHeight: 1.3 }}>{college.name}</h2>
            <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>📍 {college.location}</p>
          </div>
          <span style={{ background: college.type === "Government" ? "#dbeafe" : "#f3e8ff", color: college.type === "Government" ? "#1d4ed8" : "#7c3aed", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", whiteSpace: "nowrap" }}>
            {college.type}
          </span>
        </div>
        <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {college.description}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "10px 8px", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#0a1628", margin: "0 0 2px" }}>₹{(college.fees / 100000).toFixed(1)}L</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Fees/yr</p>
          </div>
          <div style={{ background: "#fefce8", borderRadius: "12px", padding: "10px 8px", textAlign: "center", border: "1px solid #fef08a" }}>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#854d0e", margin: "0 0 2px" }}>⭐ {college.rating}</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Rating</p>
          </div>
          <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "10px 8px", textAlign: "center", border: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#166534", margin: "0 0 2px" }}>{college.placements}</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Avg. CTC</p>
          </div>
        </div>
      </Link>

      <div style={{ padding: "12px 20px 20px", display: "flex", gap: "10px" }}>
        <Link href={`/colleges/${college.id}`} style={{ flex: 1, textAlign: "center", textDecoration: "none", background: "linear-gradient(135deg, #1e4db7, #3b82f6)", color: "#fff", padding: "11px", borderRadius: "12px", fontSize: "13px", fontWeight: 700, boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
          View Details →
        </Link>
        <button onClick={handleSave} style={{ width: "44px", height: "44px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", background: saved ? "#fee2e2" : "#f1f5f9", color: saved ? "#ef4444" : "#94a3b8", transition: "all 0.2s", boxShadow: saved ? "0 2px 8px rgba(239,68,68,0.2)" : "none" }}>
          {saved ? "♥" : "♡"}
        </button>
      </div>
    </motion.div>
  );
}