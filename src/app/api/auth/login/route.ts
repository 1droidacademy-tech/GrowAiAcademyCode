import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
       // Check if there are ANY users. If not, auto-bootstrap the first admin
       const count = await prisma.user.count();
       if (count === 0 && email.endsWith("@growaiedu.com")) {
         const hash = await bcrypt.hash(password, 10);
         const newUser = await prisma.user.create({
           data: {
             name: "Bootstrap Admin",
             email,
             phone: "0000000000",
             password_hash: hash,
             role: "ADMIN"
           }
         });
         const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
         const cookieStore = await cookies();
         cookieStore.set("growaiedu_token", token, {
           httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7, path: "/"
         });
         return NextResponse.json({ message: "Login successful (Bootstrap)", user: { id: newUser.id, role: newUser.role } }, { status: 200 });
       }
       return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const cookieStore = await cookies();
    cookieStore.set("growaiedu_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful", user: { id: user.id, role: user.role } }, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
