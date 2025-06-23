import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { z } from 'zod';
import mongoose from 'mongoose';

const ADMIN_ROLE = 'admin';

// GET all posts (for admin view)
export async function GET(request: NextRequest) {
    const requestingUserRole = request.headers.get('x-user-role');
    if (requestingUserRole !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        await dbConnect();
        const posts = await BlogPostModel.find({})
            .sort({ createdAt: -1 })
            .populate('submittedBy', 'name email'); // Populate author details
            
        return NextResponse.json({ success: true, data: posts.map(p => p.toObject()) });
    } catch (error) {
        console.error("API Error fetching blog posts:", error);
        return NextResponse.json({ success: false, error: 'Server error while fetching posts.' }, { status: 500 });
    }
}
