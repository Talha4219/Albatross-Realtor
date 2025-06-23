
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestimonialModel from '@/models/Testimonial';
import mongoose from 'mongoose';

const ADMIN_ROLE = 'admin';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserRole = request.headers.get('x-user-role');
  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid testimonial ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedTestimonial = await TestimonialModel.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return NextResponse.json({ success: false, error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Testimonial deleted successfully' });

  } catch (error) {
    console.error(`API Error deleting testimonial ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error while deleting testimonial.' }, { status: 500 });
  }
}
