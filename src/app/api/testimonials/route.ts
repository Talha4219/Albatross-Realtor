
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestimonialModel from '@/models/Testimonial';
import type { Testimonial as TestimonialType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const testimonialsFromDb = await TestimonialModel.find({}).sort({ createdAt: -1 }); // Show newest first, or sort by rating, etc.

    const testimonials: TestimonialType[] = testimonialsFromDb.map(testimonialDoc => testimonialDoc.toObject() as TestimonialType);

    return NextResponse.json({ success: true, data: testimonials }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching testimonials:", error);
    let errorMessage = 'An unknown error occurred while fetching testimonials.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// Placeholder for POST if you want to add testimonials via API later (admin only)
// export async function POST(request: NextRequest) { /* ... */ }
