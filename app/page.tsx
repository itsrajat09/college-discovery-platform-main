import Link from "next/link";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const allColleges = await prisma.college.findMany({
    orderBy: { rating: "desc" },
  });
  const featured = allColleges.slice(0, 3);
  const topRated = allColleges.slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Find Your Dream College</h1>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Discover, compare, and save top colleges across India — all in one place.
        </p>
        <div className="max-w-xl mx-auto flex gap-3">
          <input type="text" placeholder="Search colleges by name or city..." className="flex-1 p-4 rounded-xl text-gray-800 shadow focus:outline-none" readOnly />
          <Link href="/colleges" className="bg-white text-blue-600 font-semibold px-6 py-4 rounded-xl hover:bg-blue-50 transition shadow">Search</Link>
        </div>
        <div className="mt-6 flex justify-center gap-6 text-sm text-blue-100">
          <span>✅ 25+ Colleges</span>
          <span>✅ Filter by Fees & Rating</span>
          <span>✅ Compare Side by Side</span>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Colleges Listed", value: "25+" },
            { label: "Cities Covered", value: "12+" },
            { label: "Avg Placements", value: "₹25 LPA" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow p-5 text-center">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-5xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Colleges</h2>
          <Link href="/colleges" className="text-blue-600 text-sm hover:underline">View all →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((college) => (
            <Link key={college.id} href={`/colleges/${college.id}`}>
              <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition border">
                <h3 className="font-bold text-blue-700 text-lg">{college.name}</h3>
                <p className="text-gray-500 text-sm">📍 {college.location}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">⭐ {college.rating}</span>
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg">{college.placements} avg</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="max-w-5xl mx-auto px-4 mt-12 mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top Rated Colleges</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {topRated.map((college, i) => (
            <Link key={college.id} href={`/colleges/${college.id}`}>
              <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition border relative overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  #{i + 1}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{college.name}</h3>
                <p className="text-gray-500 text-sm">📍 {college.location}</p>
                <p className="text-yellow-600 font-semibold mt-2">⭐ {college.rating} / 5.0</p>
                <p className="text-gray-600 text-sm mt-1">Avg. CTC: {college.placements}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/colleges" className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition shadow">
            Explore All Colleges →
          </Link>
        </div>
      </section>
    </main>
  );
}