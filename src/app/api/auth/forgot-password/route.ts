import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account exists, a reset link will be sent." }, { status: 200 });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Delete existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { user_id: user.id },
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        user_id: user.id,
        expires_at: expiresAt,
      },
    });

    // Simulate sending email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log(`\n\n=== PASSWORD RESET LINK ===\nUser: ${email}\nLink: ${resetLink}\n===========================\n\n`);

    return NextResponse.json({ message: "If an account exists, a reset link will be sent." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
