
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestimonialModel from '@/models/Testimonial';
import { z } from 'zod';

const ADMIN_ROLE = 'admin';

// Zod schema for creating a new testimonial
const CreateTestimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(2, "Role must be at least 2 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  rating: z.coerce.number().min(1).max(5),
  imageUrl: z.string().url("Image URL must be valid.").optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
  successTag: z.string().optional(),
});

// GET all testimonials (for admin view)
export async function GET(request: NextRequest) {
    const requestingUserRole = request.headers.get('x-user-role');
    if (requestingUserRole !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        await dbConnect();
        const testimonials = await TestimonialModel.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: testimonials.map(t => t.toObject()) });
    } catch (error) {
        console.error("API Error fetching testimonials:", error);
        return NextResponse.json({ success: false, error: 'Server error while fetching testimonials.' }, { status: 500 });
    }
}

// POST a new testimonial
export async function POST(request: NextRequest) {
    const requestingUserRole = request.headers.get('x-user-role');
    if (requestingUserRole !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        await dbConnect();
        const body = await request.json();

        const validation = CreateTestimonialSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
        }

        const newTestimonial = await TestimonialModel.create(validation.data);
        return NextResponse.json({ success: true, data: newTestimonial.toObject() }, { status: 201 });

    } catch (error) {
        console.error("API Error creating testimonial:", error);
        return NextResponse.json({ success: false, error: 'Server error while creating testimonial.' }, { status: 500 });
    }
}
