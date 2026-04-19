import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await req.json();

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
    }

    // Identify user
    const cookieStore = await cookies();
    const token = cookieStore.get("growaiedu_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Fetch order from Razorpay to get actual amount
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const amountPaid = order.amount / 100;

    // Ensure course exists
    const courseExists = await prisma.course.findUnique({ where: { id: courseId } });
    if (!courseExists) {
      // Create if doesn't exist (e.g. first time)
      await prisma.course.create({
        data: {
          id: courseId,
          title: "AI Essentials for School Students",
          description: "A beginner-friendly course designed to introduce school students to the exciting world of Artificial Intelligence.",
          price: 3000,
          early_discount: 500,
          level: "Beginner",
          duration: "12 Weeks",
          status: "ACTIVE"
        }
      });
    }

    // Store Payment and Enrollment records
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          user_id: decoded.id,
          course_id: courseId,
          amount: amountPaid,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: "SUCCESS"
        }
      }),
      prisma.enrollment.upsert({
        where: { user_id_course_id: { user_id: decoded.id, course_id: courseId } },
        update: { payment_status: "COMPLETED", payment_id: razorpay_payment_id },
        create: {
          user_id: decoded.id,
          course_id: courseId,
          payment_status: "COMPLETED",
          payment_id: razorpay_payment_id
        }
      })
    ]);

    return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
