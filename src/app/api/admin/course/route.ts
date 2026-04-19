import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

function checkAdminAuth(token: string | undefined) {
   if (!token) return false;
   const decoded = verifyToken(token);
   return decoded && decoded.role === "ADMIN";
}

export async function GET(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const course = await prisma.course.findFirst({
         where: { status: "ACTIVE" }
      });

      if (!course) {
         return NextResponse.json({ message: "Course not found" }, { status: 404 });
      }

      return NextResponse.json(course, { status: 200 });
   } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: "Error fetching course" }, { status: 500 });
   }
}

export async function PUT(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { id, price, early_discount } = await req.json();

      if (!id || typeof price !== 'number' || typeof early_discount !== 'number') {
         return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
      }

      const updatedCourse = await prisma.course.update({
         where: { id },
         data: { price, early_discount }
      });

      return NextResponse.json(updatedCourse, { status: 200 });
   } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: "Error updating course" }, { status: 500 });
   }
}
