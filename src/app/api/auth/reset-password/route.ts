import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Token and new password are required" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    if (resetToken.expires_at < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json({ message: "Reset token has expired" }, { status: 400 });
    }

    // Hash new password
    const password_hash = await bcrypt.hash(password, 10);

    // Update user password and delete the token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.user_id },
        data: { password_hash },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return NextResponse.json({ message: "Password has been successfully reset" }, { status: 200 });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
