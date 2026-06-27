"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch() {
    if (query.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/colleges");
    }
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto 32px", display: "flex", gap: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px", padding: "8px 8px 8px 20px", backdropFilter: "blur(10px)" }}>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", display: "flex", alignItems: "center" }}>🔍</span>
      <input
        type="text"
        placeholder="Search colleges by name or city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "15px" }}
      />
      <button
        onClick={handleSearch}
        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontWeight: 700, padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}
      >
        Search →
      </button>
    </div>
  );
}