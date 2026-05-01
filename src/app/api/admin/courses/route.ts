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

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    const courses = await prisma.course.findMany({
      where: query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { level: { contains: query, mode: 'insensitive' } }
        ]
      } : {},
      orderBy: { created_at: "desc" },
      include: {
        enrollments: {
          where: { payment_status: "COMPLETED" }
        },
        payments: {
          where: { status: "SUCCESS" }
        }
      }
    });

    // Map through courses to calculate derived metrics before sending to client
    const coursesWithMetrics = courses.map((course) => {
      const activeStudentsCount = course.enrollments.length;
      const totalRevenue = course.payments.reduce((sum, payment) => sum + payment.amount, 0);

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        early_discount: course.early_discount,
        level: course.level,
        duration: course.duration,
        status: course.status,
        created_at: course.created_at,
        active_students: activeStudentsCount,
        total_revenue: totalRevenue
      };
    });

    return NextResponse.json(coursesWithMetrics);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
