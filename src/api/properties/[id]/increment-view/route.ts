
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import mongoose from 'mongoose';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid property ID' }, { status: 400 });
  }

  try {
    await dbConnect();
    
    // Use findByIdAndUpdate with $inc to atomically increment the views count
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true } // Return the updated document
    );

    if (!updatedProperty) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Return just a success message or the new view count
    return NextResponse.json({ success: true, views: updatedProperty.views });
  } catch (error) {
    console.error(`API Error incrementing view for property ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
