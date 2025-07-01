
import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(20, "Message must be at least 20 characters."),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@albatrossrealtor.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
    }

    const { name, email, subject, message } = validation.data;

    if (!resend) {
      console.log("RESEND_API_KEY not set. Skipping email send. Would have sent this data to admin:");
      console.log({ name, email, subject, message });
      return NextResponse.json({ success: true, message: "Inquiry logged to console (email sending is disabled)." });
    }

    const { data, error } = await resend.emails.send({
      from: `Albatross Contact Form <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      reply_to: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p>You have a new message from <strong>${name}</strong>.</p>
        <hr>
        <h2>Subject:</h2>
        <p>${subject}</p>
        <h2>Message:</h2>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr>
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
        </ul>
        <p>You can reply directly to this email to respond to ${name}.</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ success: false, error: 'Failed to send message via email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("General Contact API Error:", error);
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 });
  }
}
