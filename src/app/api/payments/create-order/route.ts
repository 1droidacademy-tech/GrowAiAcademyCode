import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const { courseId, promoCode } = await req.json();

    if (!courseId) {
       return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    // Fetch dynamic course data
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    let finalAmount = course.price - course.early_discount;

    // Apply promo code if provided
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase().trim(), is_active: true }
      });
      if (promo) {
        finalAmount -= promo.discount;
      }
    }

    // Safety check: ensure amount isn't negative
    if (finalAmount < 0) finalAmount = 0;

    // Amount in paisa for INR (e.g., ₹2500.00 -> 250000)
    const amountInPaisa = Math.round(finalAmount * 100); 

    const options = {
      amount: amountInPaisa,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ message: "Unable to create payment order" }, { status: 500 });
  }
}
