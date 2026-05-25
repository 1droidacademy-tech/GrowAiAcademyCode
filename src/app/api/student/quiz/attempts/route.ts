import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { answers, timeTaken } = body; // answers: array of { questionId: string, selectedOption: number }

    if (!answers || !Array.isArray(answers) || timeTaken === undefined) {
      return NextResponse.json({ error: "Invalid submission data" }, { status: 400 });
    }

    const totalQuestions = answers.length;
    if (totalQuestions === 0) {
      return NextResponse.json({ error: "Cannot submit empty quiz" }, { status: 400 });
    }

    let correctAnswers = 0;
    let calculatedPoints = 0;
    let maxPoints = 0;

    // Fetch the correct options for submitted question IDs to compute score on server
    const questionIds = answers.map((a) => a.questionId);
    const questions = await prisma.quizQuestion.findMany({
      where: {
        id: { in: questionIds },
      },
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (q) {
        maxPoints += q.points;
        if (ans.selectedOption === q.correctOption) {
          correctAnswers++;
          calculatedPoints += q.points;
        }
      }
    }

    // Score is the percentage of correct answers or points-based score. 
    // Let's use percentage from 0 to 100.
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Save attempt in database
    const newAttempt = await prisma.quizAttempt.create({
      data: {
        user_id: decoded.id as string,
        score: scorePercentage,
        totalQuestions,
        correctAnswers,
        timeTaken: parseInt(timeTaken),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      attemptId: newAttempt.id,
      score: scorePercentage,
      totalQuestions,
      correctAnswers,
      pointsScored: calculatedPoints,
      maxPoints,
      timeTaken,
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
