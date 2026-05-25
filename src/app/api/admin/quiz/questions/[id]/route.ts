import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { question, options, correctOption, topic, timeLimit, points } = body;

    // Check if question exists
    const existing = await prisma.quizQuestion.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id },
      data: {
        question: question !== undefined ? question : existing.question,
        options: options !== undefined ? options : existing.options,
        correctOption: correctOption !== undefined ? parseInt(correctOption) : existing.correctOption,
        topic: topic !== undefined ? topic : existing.topic,
        timeLimit: timeLimit !== undefined ? parseInt(timeLimit) : existing.timeLimit,
        points: points !== undefined ? parseInt(points) : existing.points,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const existing = await prisma.quizQuestion.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    await prisma.quizQuestion.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
