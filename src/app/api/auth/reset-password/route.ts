
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const validation = ResetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid data.", details: validation.error.flatten() }, { status: 400 });
    }

    const { token, password } = validation.data;
    
    // Hash the token from the user to compare with the stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() }
    }).select('+passwordHash'); // We need passwordHash to update it

    if (!user) {
      return NextResponse.json({ success: false, error: "Token is invalid or has expired." }, { status: 400 });
    }

    // Set the new password
    user.passwordHash = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Password has been reset successfully." });

  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 });
  }
}
