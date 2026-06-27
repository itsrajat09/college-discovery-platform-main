import Link from "next/link";
import Navbar from "@/components/Navbar";
import HomeSearch from "@/components/HomeSearch";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const allColleges = await prisma.college.findMany({ orderBy: { rating: "desc" } });
  const featured = allColleges.slice(0, 3);
  const topRated = allColleges.slice(0, 3);

  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <style>{`
        .hero-section { padding: 64px 20px 100px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .featured-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .toprated-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .cta-banner { padding: 48px 32px; }
        .cta-title { font-size: 28px; }
        .badge-row { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .hero-section { padding: 44px 16px 80px; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .featured-grid { grid-template-columns: 1fr; gap: 14px; }
          .toprated-grid { grid-template-columns: 1fr; gap: 14px; }
          .cta-banner { padding: 32px 20px; border-radius: 20px !important; }
          .cta-title { font-size: 22px !important; }
          .badge-row { gap: 8px; }
          .section-header { flex-direction: column; align-items: flex-start !important; gap: 10px; }
        }
      `}</style>

      {/* HERO */}
      <section className="hero-section" style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d2060 40%, #1a3a8f 70%, #1e4db7 100%)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(59,130,246,0.15)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "-40px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "100px", padding: "6px 18px", color: "#93c5fd", fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "20px" }}>
          🎓 India&apos;s #1 College Discovery Platform
        </div>

        <h1 style={{ fontSize: "clamp(1.9rem, 7vw, 4rem)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
          Find Your{" "}
          <span style={{ background: "linear-gradient(90deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Dream College
          </span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(14px, 3.5vw, 18px)", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Discover, compare, and save top colleges across India — all in one place.
        </p>

        {/* Search box — type karke colleges page pe search hogi */}
        <HomeSearch />

        <div className="badge-row">
          {["✅ 25+ Colleges", "✅ Filter by Fees & Rating", "✅ Compare Side by Side"].map((f) => (
            <span key={f} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", padding: "6px 14px", borderRadius: "100px", fontSize: "12px" }}>{f}</span>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: "900px", margin: "-40px auto 0", padding: "0 16px", position: "relative", zIndex: 10 }}>
        <div className="stats-grid">
          {[
            { value: `${allColleges.length}+`, label: "Colleges Listed", icon: "🏫", color: "#3b82f6" },
            { value: "12+", label: "Cities Covered", icon: "🌆", color: "#6366f1" },
            { value: "₹25 LPA", label: "Avg Placements", icon: "💼", color: "#0ea5e9" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", borderRadius: "16px", padding: "18px 12px", textAlign: "center", boxShadow: "0 8px 32px rgba(30,77,183,0.12)", border: "1px solid rgba(59,130,246,0.1)" }}>
              <div style={{ fontSize: "24px", marginBottom: "6px" }}>{s.icon}</div>
              <p style={{ fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 800, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: "11px", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLEGES */}
      <section style={{ maxWidth: "900px", margin: "48px auto 0", padding: "0 16px" }}>
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <p style={{ color: "#3b82f6", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Handpicked for you</p>
            <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#0a1628", margin: 0 }}>Featured Colleges</h2>
          </div>
          <Link href="/colleges" style={{ color: "#3b82f6", fontSize: "14px", fontWeight: 600, textDecoration: "none", background: "rgba(59,130,246,0.08)", padding: "8px 14px", borderRadius: "10px", whiteSpace: "nowrap" }}>View all →</Link>
        </div>
        <div className="featured-grid">
          {featured.map((college) => (
            <Link key={college.id} href={`/colleges/${college.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: "18px", padding: "20px", boxShadow: "0 4px 20px rgba(30,77,183,0.08)", border: "1px solid rgba(59,130,246,0.1)", cursor: "pointer" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #dbeafe, #e0e7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" }}>🎓</div>
                <h3 style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "15px", margin: "0 0 4px" }}>{college.name}</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "0 0 12px" }}>📍 {college.location}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ background: "#fefce8", color: "#854d0e", padding: "3px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>⭐ {college.rating}</span>
                  <span style={{ background: "#f0fdf4", color: "#166534", padding: "3px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>{college.placements} avg</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP RATED */}
      <section style={{ maxWidth: "900px", margin: "48px auto 0", padding: "0 16px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#3b82f6", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Best of the best</p>
          <h2 style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#0a1628", margin: 0 }}>🏆 Top Rated Colleges</h2>
        </div>
        <div className="toprated-grid">
          {topRated.map((college, i) => (
            <Link key={college.id} href={`/colleges/${college.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: i === 0 ? "linear-gradient(135deg, #0d2060, #1e4db7)" : "#fff",
                borderRadius: "18px", padding: "20px", position: "relative",
                boxShadow: i === 0 ? "0 8px 32px rgba(30,77,183,0.35)" : "0 4px 20px rgba(30,77,183,0.08)",
                border: i === 0 ? "none" : "1px solid rgba(59,130,246,0.1)", cursor: "pointer"
              }}>
                <div style={{ position: "absolute", top: "14px", right: "14px", width: "28px", height: "28px", borderRadius: "50%", background: i === 0 ? "rgba(255,255,255,0.2)" : i === 1 ? "#e0e7ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: i === 0 ? "#fff" : i === 1 ? "#4f46e5" : "#64748b" }}>#{i + 1}</div>
                <div style={{ fontSize: "26px", marginBottom: "10px" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                <h3 style={{ fontWeight: 800, fontSize: "15px", margin: "0 0 4px", color: i === 0 ? "#fff" : "#0a1628" }}>{college.name}</h3>
                <p style={{ fontSize: "13px", margin: "0 0 10px", color: i === 0 ? "rgba(255,255,255,0.6)" : "#94a3b8" }}>📍 {college.location}</p>
                <p style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 2px", color: i === 0 ? "#fbbf24" : "#d97706" }}>⭐ {college.rating} / 5.0</p>
                <p style={{ fontSize: "13px", margin: 0, color: i === 0 ? "rgba(255,255,255,0.6)" : "#64748b" }}>Avg. CTC: {college.placements}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ maxWidth: "900px", margin: "48px auto 72px", padding: "0 16px" }}>
        <div className="cta-banner" style={{ background: "linear-gradient(135deg, #0d2060, #1a3a8f, #1e4db7)", borderRadius: "24px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(30,77,183,0.3)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(99,102,241,0.2)", filter: "blur(40px)", pointerEvents: "none" }} />
          <p style={{ color: "#93c5fd", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>Ready to start?</p>
          <h2 className="cta-title" style={{ color: "#fff", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Explore All Colleges in India</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", margin: "0 0 28px" }}>Filter by fees, rating, city and more — find your perfect match.</p>
          <Link href="/colleges" style={{ display: "inline-block", background: "#fff", color: "#1e4db7", fontWeight: 800, padding: "13px 32px", borderRadius: "12px", textDecoration: "none", fontSize: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            Explore All Colleges →
          </Link>
        </div>
      </section>
    </main>
  );
}