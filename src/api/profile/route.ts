
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  profilePictureUrl: z.string().optional(),
  phone: z.string().optional(),
  specialty: z.string().optional(),
});

export async function GET(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Unauthorized or Invalid User ID' }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: user.toObject() });
    } catch (error) {
        console.error("API Error fetching user profile:", error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Unauthorized or Invalid User ID' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const validation = UpdateProfileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
        }
        
        const updateData = validation.data;
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, error: 'No update data provided' }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedUser.toObject() });
    } catch (error) {
        console.error("API Error updating user profile:", error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
