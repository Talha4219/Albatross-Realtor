
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
});

export async function POST(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Unauthorized or Invalid User ID' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const validation = ChangePasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
        }
        
        const { currentPassword, newPassword } = validation.data;

        const user = await User.findById(userId).select('+passwordHash');
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 403 });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        return NextResponse.json({ success: true, message: "Password updated successfully." });

    } catch (error) {
        console.error("API Error changing password:", error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
