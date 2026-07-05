import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Function to generate a unique certificate ID in the format GAE-AI-[Year]-[0001]
async function generateUniqueCertificateId() {
  const year = new Date().getFullYear();
  const prefix = `GAE-AI-${year}-`;
  
  // Fetch last certificate starting with the prefix to determine the next sequential number
  const lastCert = await prisma.certificate.findFirst({
    where: {
      id: {
        startsWith: prefix,
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  let nextNum = 1;

  if (lastCert) {
    const parts = lastCert.id.split("-");
    const lastNumStr = parts[parts.length - 1];
    const parsedNum = parseInt(lastNumStr, 10);
    if (!isNaN(parsedNum)) {
      nextNum = parsedNum + 1;
    }
  }

  // Ensure uniqueness in the database in case of manual ID deletions/insertions
  let candidateId = `${prefix}${String(nextNum).padStart(4, "0")}`;
  let exists = await prisma.certificate.findUnique({
    where: { id: candidateId },
  });

  while (exists) {
    nextNum++;
    candidateId = `${prefix}${String(nextNum).padStart(4, "0")}`;
    exists = await prisma.certificate.findUnique({
      where: { id: candidateId },
    });
  }

  return candidateId;
}

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

    const certificates = await prisma.certificate.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
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
    const { student_name, course_title, grade, issue_date, custom_id } = body;

    if (!student_name || !course_title) {
      return NextResponse.json({ error: "Student name and Course title are required" }, { status: 400 });
    }

    let finalId = "";
    if (custom_id && custom_id.trim()) {
      const trimmedId = custom_id.trim();
      
      // Check if this ID is already taken
      const existing = await prisma.certificate.findUnique({
        where: { id: trimmedId },
      });
      
      if (existing) {
        return NextResponse.json({ error: "Certificate ID is already in use" }, { status: 400 });
      }
      
      finalId = trimmedId;
    } else {
      finalId = await generateUniqueCertificateId();
    }

    const certificate = await prisma.certificate.create({
      data: {
        id: finalId,
        student_name,
        course_title,
        grade: grade || null,
        issue_date: issue_date ? new Date(issue_date) : new Date(),
      },
    });

    return NextResponse.json(certificate, { status: 21 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
