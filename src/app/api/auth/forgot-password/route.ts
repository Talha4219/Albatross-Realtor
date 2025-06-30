
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import { Resend } from 'resend';
import { z } from 'zod';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
// Using Resend's test address is a good default for development
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const validation = ForgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid email.", details: validation.error.flatten() }, { status: 400 });
    }
    
    const { email } = validation.data;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetToken +passwordResetTokenExpires');

    // Always return a success message to prevent email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent user: ${email}`);
      return NextResponse.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expiry to 10 minutes from now
    user.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); 

    await user.save();
    
    // Construct the reset URL using the request's origin
    const resetUrl = `${request.nextUrl.origin}/auth/reset-password?token=${resetToken}`;
    
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: `Albatross Realtor <${FROM_EMAIL}>`,
        to: user.email,
        subject: 'Reset Your Password for Albatross Realtor',
        html: `<p>Hi ${user.name},</p>
               <p>You requested a password reset. Click the link below to set a new password:</p>
               <p><a href="${resetUrl}" style="background-color: #3F51B5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
               <p>This link will expire in 10 minutes.</p>
               <p>If you did not request this, please ignore this email.</p>`,
      });
       if (error) {
        console.error('Resend API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email.' }, { status: 500 });
      }
    } else {
      console.log('RESEND_API_KEY not set. Skipping email send.');
      console.log(`Password Reset URL for ${user.email}: ${resetUrl}`);
    }

    return NextResponse.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });

  } catch (error) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 });
  }
}
