
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
    // If rejecting, might also want to change general status to Draft or similar
    if (approvalStatus === 'Rejected') {
        propertyToUpdate.status = 'Draft'; // Example: move to Draft status if rejected
    } else if (approvalStatus === 'Approved' && propertyToUpdate.status === 'Pending Approval') {
        // If it was 'Pending Approval' and now 'Approved', set its actual listing status e.g. 'For Sale'
        // This assumes the original intended status was stored or is defaulted.
        // For simplicity, let's assume it becomes 'For Sale' or keeps its existing non-pending status.
        // If property.status was 'Pending Approval', we might need to know what it *should* become.
        // Let's assume 'For Sale' if it was 'Pending Approval'
        if(propertyToUpdate.status === 'Pending Approval' || propertyToUpdate.status === 'Draft'){
            propertyToUpdate.status = 'For Sale'; // Default active status post-approval
        }
    }


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
