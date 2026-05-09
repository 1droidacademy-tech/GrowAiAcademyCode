import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { visitor_id } = await request.json();

    if (!visitor_id || typeof visitor_id !== 'string') {
      return NextResponse.json({ error: "Invalid visitor_id" }, { status: 400 });
    }

    // Attempt to create a new unique visitor.
    // If it already exists, Prisma will throw a unique constraint violation (P2002),
    // which we will catch and ignore.
    try {
      await prisma.uniqueVisitor.create({
        data: {
          visitor_id: visitor_id,
        },
      });
    } catch (dbError: any) {
      if (dbError.code === 'P2002') {
        // Unique constraint failed, visitor already exists. That's fine.
        return NextResponse.json({ status: "exists" });
      }
      throw dbError; // Re-throw other errors
    }

    return NextResponse.json({ status: "created" });
  } catch (error) {
    console.error("Analytics track error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
