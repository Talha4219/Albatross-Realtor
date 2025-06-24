
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { z } from 'zod';
import type { UserRole } from '@/types';

const ADMIN_ROLE = 'admin';
const ADMIN_SUPER_EMAIL = process.env.ADMIN_EMAIL || 'admin@albatrossrealtor.com';

const UpdateRoleSchema = z.object({
  role: z.enum(['user', 'agent', 'admin']),
});

export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  const requestingUserRole = request.headers.get('x-user-role');

  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { userId } = params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ success: false, error: 'Invalid user ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = UpdateRoleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
    }

    const { role } = validation.data;

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from changing the primary admin's role away from admin
    if (userToUpdate.email === ADMIN_SUPER_EMAIL && role !== 'admin') {
         return NextResponse.json({ success: false, error: 'Cannot change the primary admin\'s role.' }, { status: 403 });
    }
    
    userToUpdate.role = role as UserRole;
    await userToUpdate.save();

    return NextResponse.json({ success: true, data: userToUpdate.toObject() }, { status: 200 });

  } catch (error) {
    console.error(`API Error updating user ${userId} role:`, error);
    let errorMessage = 'An unknown error occurred while updating user role.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
