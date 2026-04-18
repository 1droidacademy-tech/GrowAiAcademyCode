import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newContact = await prisma.contactMessage.create({
      data: { name, email, phone, message },
    });

    return NextResponse.json({ message: "Message received successfully", contactId: newContact.id }, { status: 201 });
  } catch (error: any) {
    console.error("Contact error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
