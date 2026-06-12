import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { name, lastName, phone, message } = await req.json();
  const token = process.env.RESEND_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(token);

  try {
    await resend.emails.send({
      from: "Portfolio Ana <anaartista.com>",
      to: "anaartista122@gmail.com",
      subject: "Portfolio Ana - New message from contact form",
      text: `
                Name: ${name}
                Last Name: ${lastName}
                Phone: ${phone}
                
                Message: ${message}
            `,
    });
    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending form:", error);
    return NextResponse.json({ error: "Error sending form" }, { status: 500 });
  }
}
