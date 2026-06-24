import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const minRating = parseFloat(searchParams.get("rating") || "0");
  const maxFees = parseInt(searchParams.get("maxFees") || "9999999");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 9;

  const where = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { location: { contains: search, mode: "insensitive" as const } },
        ],
      } : {},
      location ? { location: { contains: location, mode: "insensitive" as const } } : {},
      minRating > 0 ? { rating: { gte: minRating } } : {},
      maxFees < 9999999 ? { fees: { lte: maxFees } } : {},
    ],
  };

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { rating: "desc" },
    }),
    prisma.college.count({ where }),
  ]);

  return NextResponse.json({
    colleges,
    total,
    totalPages: Math.ceil(total / limit),
    page,
  });
}