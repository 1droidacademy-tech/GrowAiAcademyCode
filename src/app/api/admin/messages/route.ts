import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

function checkAdminAuth(token: string | undefined) {
   if (!token) return false;
   const decoded = verifyToken(token);
   if (!decoded || decoded.role !== "ADMIN") return false;
   return true;
}

export async function GET(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const messages = await prisma.contactMessage.findMany({
         orderBy: { created_at: "desc" }
      });

      return NextResponse.json(messages, { status: 200 });
   } catch (error: any) {
      console.error("Error fetching admin messages:", error);
      return NextResponse.json({ message: "Error fetching messages" }, { status: 500 });
   }
}

export async function DELETE(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ message: "ID missing" }, { status: 400 });

      await prisma.contactMessage.delete({ where: { id } });

      return NextResponse.json({ message: "Message deleted" }, { status: 200 });
   } catch (error: any) {
      console.error("Error deleting admin message:", error);
      return NextResponse.json({ message: "Error deleting message" }, { status: 500 });
   }
}
