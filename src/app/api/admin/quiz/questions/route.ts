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
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questions = await prisma.quizQuestion.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("growaiedu_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { question, options, correctOption, topic, timeLimit, points } = body;

    if (!question || !options || options.length < 2 || correctOption === undefined || !topic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        question,
        options,
        correctOption: parseInt(correctOption),
        topic,
        timeLimit: timeLimit ? parseInt(timeLimit) : 30,
        points: points ? parseInt(points) : 10,
      },
    });

    return NextResponse.json(newQuestion, { status: 21 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
