import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

function checkAdminAuth(token: string | undefined) {
   if (!token) {
      console.log("Admin Auth Failed: No token found");
      return false;
   }
   const decoded = verifyToken(token);
   if (!decoded) {
      console.log("Admin Auth Failed: Invalid token");
      return false;
   }
   if (decoded.role !== "ADMIN") {
      console.log("Admin Auth Failed: Role is not ADMIN", decoded.role);
      return false;
   }
   return true;
}

export async function GET(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const codes = await prisma.promoCode.findMany({
         orderBy: { created_at: "desc" }
      });

      return NextResponse.json(codes, { status: 200 });
   } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: "Error fetching promo codes" }, { status: 500 });
   }
}

export async function POST(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { code, discount, is_active } = await req.json();

      if (!code || typeof discount !== 'number') {
         return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
      }

      const newCode = await prisma.promoCode.create({
         data: {
            code: code.toUpperCase().trim(),
            discount,
            is_active: is_active ?? true
         }
      });

      return NextResponse.json(newCode, { status: 201 });
   } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: "Error creating promo code. Might be duplicate." }, { status: 500 });
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

      await prisma.promoCode.delete({ where: { id } });

      return NextResponse.json({ message: "Deleted" }, { status: 200 });
   } catch (error: any) {
      return NextResponse.json({ message: "Error deleting" }, { status: 500 });
   }
}

export async function PUT(req: Request) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("growaiedu_token")?.value;
      if (!checkAdminAuth(token)) {
         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { id, is_active } = await req.json();

      const updated = await prisma.promoCode.update({
         where: { id },
         data: { is_active }
      });

      return NextResponse.json(updated, { status: 200 });
   } catch (error: any) {
      return NextResponse.json({ message: "Error updating" }, { status: 500 });
   }
}
