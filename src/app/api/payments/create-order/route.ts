import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
       return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
    }

    // Amount in paisa for INR (e.g., ₹544.00)
    const amountInPaisa = 54400; 

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
