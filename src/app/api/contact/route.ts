import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Save to database
    const newContact = await prisma.contactMessage.create({
      data: { name, email, phone, message },
    });

    // Send email notification to admin
    try {
      await resend.emails.send({
        from: "GrowAiEdu Contact <onboarding@resend.dev>",
        to: "growaiadmin@gmail.com",
        replyTo: email,
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <h2 style="color: #4f46e5; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">New Student Inquiry</h2>
            <div style="margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
            </div>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; color: #334155;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; pt: 12px;">
              This message was sent from the GrowAiEdu contact form and stored in the database.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send contact notification email:", emailError);
      // We don't fail the whole request since it's already in the database
    }

    return NextResponse.json({ message: "Message received successfully", contactId: newContact.id }, { status: 201 });
  } catch (error: any) {
    console.error("Contact error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
