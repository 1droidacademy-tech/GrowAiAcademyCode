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
    const status = searchParams.get('status') || '';

    // Build the query
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    if (query) {
      whereClause.OR = [
        { razorpay_payment_id: { contains: query, mode: 'insensitive' } },
        { razorpay_order_id: { contains: query, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
      take: 200, // Limit to recent 200 to keep UI snappy, add pagination later if needed
      include: {
        user: true,
        course: true
      }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
