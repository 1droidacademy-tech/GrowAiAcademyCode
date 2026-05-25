import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("growaiedu_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const topic = searchParams.get("topic");

    const questions = await prisma.quizQuestion.findMany({
      where: topic && topic !== "All" ? { topic } : {},
      orderBy: { created_at: "asc" },
      select: {
        id: true,
        question: true,
        options: true,
        topic: true,
        timeLimit: true,
        points: true,
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching student questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
