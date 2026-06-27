import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getUserIdFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    include: { college: true },
  });
  return NextResponse.json(saved.map((s: { college: unknown }) => s.college));
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collegeId } = await req.json();
  if (!collegeId)
    return NextResponse.json({ error: "Missing collegeId" }, { status: 400 });

  const saved = await prisma.savedCollege.upsert({
    where: { userId_collegeId: { userId, collegeId } },
    update: {},
    create: { userId, collegeId },
  });
  return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collegeId } = await req.json();
  await prisma.savedCollege.deleteMany({ where: { userId, collegeId } });
  return NextResponse.json({ success: true });
}