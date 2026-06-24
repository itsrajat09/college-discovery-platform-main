import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    include: { college: true },
  });
 return NextResponse.json(saved.map((s: { college: unknown }) => s.college));
}

export async function POST(req: NextRequest) {
  const { userId, collegeId } = await req.json();
  if (!userId || !collegeId)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const saved = await prisma.savedCollege.upsert({
    where: { userId_collegeId: { userId, collegeId } },
    update: {},
    create: { userId, collegeId },
  });
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
  const { userId, collegeId } = await req.json();
  await prisma.savedCollege.deleteMany({ where: { userId, collegeId } });
  return NextResponse.json({ success: true });
}