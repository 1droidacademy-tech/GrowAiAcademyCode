import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_CONFIG, getResetPasswordEmail } from "@/lib/email";
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

    // Send actual email
    try {
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const { data, error: sendError } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email,
        subject: "Reset Your GrowAiEdu Password",
        html: getResetPasswordEmail(user.name, resetLink),
      });

      if (sendError) {
        console.error("Resend API Error details:", sendError);
        // During development, we can check if it's the "onboarding" restriction
        if (sendError.message.includes("onboarding")) {
          console.warn("⚠️ FORGOT PASSWORD: Check if the sending domain is verified in your Resend account.");
        }
      } else {
        console.log(`Password reset email triggered successfully for: ${email}. ID: ${data?.id}`);
      }
    } catch (emailError: any) {
      console.error("Critical failure in Resend dispatch:", emailError.message);
    }

    return NextResponse.json({ message: "If an account exists, a reset link will be sent." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
