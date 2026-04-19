import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
   try {
      const { code } = await req.json();

      if (!code) {
         return NextResponse.json({ message: "Code missing" }, { status: 400 });
      }

      const promo = await prisma.promoCode.findUnique({
         where: { code: code.toUpperCase().trim() }
      });

      if (!promo || !promo.is_active) {
         return NextResponse.json({ valid: false, message: "Invalid or expired promo code" }, { status: 404 });
      }

      return NextResponse.json({ valid: true, discount: promo.discount, id: promo.id }, { status: 200 });
   } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: "Error validating code" }, { status: 500 });
   }
}
