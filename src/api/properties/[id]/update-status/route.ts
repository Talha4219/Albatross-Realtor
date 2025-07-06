
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { z } from 'zod';

const UpdateStatusSchema = z.object({
  approvalStatus: z.enum(['Approved', 'Rejected', 'Pending']),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const userRole = request.headers.get('x-user-role');

  if (userRole !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid property ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = UpdateStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
    }

    const { approvalStatus } = validation.data;

    const propertyToUpdate = await Property.findById(id);
    if (!propertyToUpdate) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    propertyToUpdate.approvalStatus = approvalStatus;
    
    // If an admin rejects a property, it's useful to move it to 'Draft' status
    // so the agent can see it in their listings and edit it.
    if (approvalStatus === 'Rejected') {
        propertyToUpdate.status = 'Draft'; 
    }
    // No need for an else block. Approving a property should just change its
    // approvalStatus, not its intended listing status ('For Sale' or 'For Rent').

    await propertyToUpdate.save();

    return NextResponse.json({ success: true, data: propertyToUpdate.toObject() }, { status: 200 });

  } catch (error) {
    console.error(`API Error updating property ${id} status:`, error);
    let errorMessage = 'An unknown error occurred while updating property status.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (errorMessage.includes("MONGODB_URI")) {
      errorMessage = "Database configuration error.";
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
