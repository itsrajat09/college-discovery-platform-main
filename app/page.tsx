import Link from "next/link";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const allColleges = await prisma.college.findMany({ orderBy: { rating: "desc" } });
  const featured = allColleges.slice(0, 3);
  const topRated = allColleges.slice(0, 3);

  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d2060 40%, #1a3a8f 70%, #1e4db7 100%)",
        padding: "90px 24px 120px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(59,130,246,0.15)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-40px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "6px 20px", color: "#93c5fd", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "24px" }}>
          🎓 India&apos;s #1 College Discovery Platform
        </div>

        <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          Find Your{" "}
          <span style={{ background: "linear-gradient(90deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Dream College
          </span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.6 }}>
          Discover, compare, and save top colleges across India — all in one place.
        </p>

        <div style={{ maxWidth: "560px", margin: "0 auto 32px", display: "flex", gap: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "16px", padding: "8px 8px 8px 20px", backdropFilter: "blur(10px)" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", display: "flex", alignItems: "center" }}>🔍</span>
          <input type="text" placeholder="Search colleges by name or city..." readOnly style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "15px" }} />
          <Link href="/colleges" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontWeight: 700, padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
            Search →
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          {["✅ 25+ Colleges", "✅ Filter by Fees & Rating", "✅ Compare Side by Side"].map((f) => (
            <span key={f} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "6px 16px", borderRadius: "100px", fontSize: "13px" }}>{f}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: "900px", margin: "-44px auto 0", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { value: `${allColleges.length}+`, label: "Colleges Listed", icon: "🏫", color: "#3b82f6" },
            { value: "12+", label: "Cities Covered", icon: "🌆", color: "#6366f1" },
            { value: "₹25 LPA", label: "Avg Placements", icon: "💼", color: "#0ea5e9" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "20px", padding: "24px", textAlign: "center", boxShadow: "0 8px 32px rgba(30,77,183,0.12)", border: "1px solid rgba(59,130,246,0.1)" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
              <p style={{ fontSize: "28px", fontWeight: 800, color: s.color, margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLEGES */}
      <section style={{ maxWidth: "900px", margin: "56px auto 0", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <p style={{ color: "#3b82f6", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Handpicked for you</p>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0a1628", margin: 0 }}>Featured Colleges</h2>
          </div>
          <Link href="/colleges" style={{ color: "#3b82f6", fontSize: "14px", fontWeight: 600, textDecoration: "none", background: "rgba(59,130,246,0.08)", padding: "8px 16px", borderRadius: "10px" }}>View all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {featured.map((college) => (
            <Link key={college.id} href={`/colleges/${college.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 20px rgba(30,77,183,0.08)", border: "1px solid rgba(59,130,246,0.1)", cursor: "pointer" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #dbeafe, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "14px" }}>🎓</div>
                <h3 style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "16px", margin: "0 0 6px" }}>{college.name}</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 14px" }}>📍 {college.location}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ background: "#fefce8", color: "#854d0e", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>⭐ {college.rating}</span>
                  <span style={{ background: "#f0fdf4", color: "#166534", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>{college.placements} avg</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP RATED */}
      <section style={{ maxWidth: "900px", margin: "56px auto 0", padding: "0 24px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ color: "#3b82f6", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Best of the best</p>
          <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0a1628", margin: 0 }}>🏆 Top Rated Colleges</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {topRated.map((college, i) => (
            <Link key={college.id} href={`/colleges/${college.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: i === 0 ? "linear-gradient(135deg, #0d2060, #1e4db7)" : "#fff",
                borderRadius: "20px", padding: "24px", position: "relative",
                boxShadow: i === 0 ? "0 8px 32px rgba(30,77,183,0.35)" : "0 4px 20px rgba(30,77,183,0.08)",
                border: i === 0 ? "none" : "1px solid rgba(59,130,246,0.1)", cursor: "pointer"
              }}>
                <div style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", background: i === 0 ? "rgba(255,255,255,0.2)" : i === 1 ? "#e0e7ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: i === 0 ? "#fff" : i === 1 ? "#4f46e5" : "#64748b" }}>#{i + 1}</div>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                <h3 style={{ fontWeight: 800, fontSize: "16px", margin: "0 0 6px", color: i === 0 ? "#fff" : "#0a1628" }}>{college.name}</h3>
                <p style={{ fontSize: "13px", margin: "0 0 14px", color: i === 0 ? "rgba(255,255,255,0.6)" : "#94a3b8" }}>📍 {college.location}</p>
                <p style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px", color: i === 0 ? "#fbbf24" : "#d97706" }}>⭐ {college.rating} / 5.0</p>
                <p style={{ fontSize: "13px", margin: 0, color: i === 0 ? "rgba(255,255,255,0.6)" : "#64748b" }}>Avg. CTC: {college.placements}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ maxWidth: "900px", margin: "56px auto 80px", padding: "0 24px" }}>
        <div style={{ background: "linear-gradient(135deg, #0d2060, #1a3a8f, #1e4db7)", borderRadius: "28px", padding: "48px 40px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(30,77,183,0.3)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(99,102,241,0.2)", filter: "blur(40px)", pointerEvents: "none" }} />
          <p style={{ color: "#93c5fd", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Ready to start?</p>
          <h2 style={{ color: "#fff", fontSize: "28px", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Explore All Colleges in India</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", margin: "0 0 32px" }}>Filter by fees, rating, city and more — find your perfect match.</p>
          <Link href="/colleges" style={{ display: "inline-block", background: "#fff", color: "#1e4db7", fontWeight: 800, padding: "14px 36px", borderRadius: "14px", textDecoration: "none", fontSize: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            Explore All Colleges →
          </Link>
        </div>
      </section>
    </main>
  );
}