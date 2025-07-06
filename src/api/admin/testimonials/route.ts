
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestimonialModel from '@/models/Testimonial';
import { z } from 'zod';

const CreateTestimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  rating: z.coerce.number().min(1).max(5),
  imageUrl: z.string().url("Image URL must be valid.").optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
  successTag: z.string().optional(),
});

function isAdmin(request: NextRequest) {
    return request.headers.get('x-user-role') === 'admin';
}

export async function GET(request: NextRequest) {
    if (!isAdmin(request)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    try {
        await dbConnect();
        const testimonials = await TestimonialModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: testimonials.map(t => t.toObject()) });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (!isAdmin(request)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    try {
        await dbConnect();
        const body = await request.json();
        const validation = CreateTestimonialSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
        }
        const newTestimonial = await TestimonialModel.create(validation.data);
        return NextResponse.json({ success: true, data: newTestimonial.toObject() }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
