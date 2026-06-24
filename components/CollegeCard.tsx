"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { toggleSaved, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { College } from "@/lib/colleges";

type Props = {
  college: College;
  index: number;
  isSaved?: boolean;
};

export default function CollegeCard({ college, index, isSaved = false }: Props) {
  const [saved, setSaved] = useState(isSaved);
  const router = useRouter();

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    const updated = toggleSaved(college.id);
    setSaved(updated.includes(college.id));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-md border hover:shadow-xl transition-shadow"
    >
      <Link href={`/colleges/${college.id}`} className="block p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-blue-700">{college.name}</h2>
            <p className="text-gray-500 text-sm mt-1">📍 {college.location}</p>
          </div>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
            {college.type}
          </span>
        </div>

        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{college.description}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="font-semibold text-gray-800">₹{(college.fees / 100000).toFixed(1)}L</p>
            <p className="text-gray-400 text-xs">Fees/yr</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <p className="font-semibold text-yellow-700">⭐ {college.rating}</p>
            <p className="text-gray-400 text-xs">Rating</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2">
            <p className="font-semibold text-green-700">{college.placements}</p>
            <p className="text-gray-400 text-xs">Avg. CTC</p>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-4 flex gap-2">
        <Link
          href={`/colleges/${college.id}`}
          className="flex-1 text-center bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700 transition"
        >
          View Details →
        </Link>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-xl text-sm border transition ${
            saved
              ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
              : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
          }`}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
    </motion.div>
  );
}
