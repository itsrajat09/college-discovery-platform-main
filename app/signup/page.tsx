"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { setError(data.error); return; }
    loginUser(data.user, data.token);
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a1628 0%, #0d2060 50%, #1e4db7 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>

      {/* blobs */}
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(99,102,241,0.2)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(59,130,246,0.2)", filter: "blur(70px)", pointerEvents: "none" }} />

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", marginBottom: "32px", textAlign: "center" }}>
        <div style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>🎓 CollegeDiscover</div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", marginTop: "4px" }}>India&apos;s #1 College Discovery Platform</div>
      </Link>

      {/* White Card */}
      <div style={{ width: "100%", maxWidth: "400px", background: "#fff", borderRadius: "24px", boxShadow: "0 24px 64px rgba(0,0,0,0.35)", padding: "36px", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎓</div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#0a1628", margin: "0 0 6px" }}>Create Account</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Start discovering your dream college today</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "14px", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "12px 16px", fontSize: "15px", color: "#0a1628", outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "12px 16px", fontSize: "15px", color: "#0a1628", outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "12px 16px", fontSize: "15px", color: "#0a1628", outline: "none", background: "#f8fafc", boxSizing: "border-box" }}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            style={{ width: "100%", background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e4db7, #3b82f6)", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: "4px", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}
          >
            {loading ? "Creating account..." : "Sign Up →"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#94a3b8", marginTop: "24px", marginBottom: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}