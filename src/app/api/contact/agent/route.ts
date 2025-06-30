
import { NextResponse, type NextRequest } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const contactAgentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  agentEmail: z.string().email(),
  agentName: z.string(),
  propertyAddress: z.string(),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactAgentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, message, agentEmail, agentName, propertyAddress } = validation.data;

    if (!resend) {
      console.log("RESEND_API_KEY not set. Skipping email send. Would have sent this data:");
      console.log({ name, email, phone, message, agentEmail, propertyAddress });
      return NextResponse.json({ success: true, message: "Inquiry logged to console (email sending is disabled)." });
    }

    const { data, error } = await resend.emails.send({
      from: `Albatross Realtor <${FROM_EMAIL}>`,
      to: agentEmail,
      reply_to: email,
      subject: `New Inquiry for ${propertyAddress}`,
      html: `
        <h1>New Property Inquiry</h1>
        <p>You have a new inquiry from <strong>${name}</strong> for the property at <strong>${propertyAddress}</strong>.</p>
        <hr>
        <h2>Message:</h2>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr>
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> <a href="mailto:${email}">${email}</a></li>
          ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
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
    console.error("Agent Contact API Error:", error);
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 });
  }
}
