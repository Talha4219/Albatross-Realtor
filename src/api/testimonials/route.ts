
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestimonialModel from '@/models/Testimonial';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const testimonials = await TestimonialModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials.map(t => t.toObject()) });
  } catch (error) {
    console.error("API Error fetching testimonials:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
