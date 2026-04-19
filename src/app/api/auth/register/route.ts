import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, email, phone, school_name, class_grade, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ message: "Please enter a valid Indian phone number" }, { status: 400 });
    }

    const existingEmail = await prisma.user.findFirst({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
    }

    const existingPhone = await prisma.user.findFirst({ where: { phone } });
    if (existingPhone) {
      return NextResponse.json({ message: "An account with this phone number already exists" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const role = email.endsWith("@growaiedu.com") ? "ADMIN" : "STUDENT";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password_hash,
        school_name,
        class_grade,
        role,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set("growaiedu_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ message: "Registration successful", user: { id: user.id, name, email, role } }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
