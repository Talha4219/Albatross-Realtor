
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { z } from 'zod';
import mongoose from 'mongoose';
import { blogCategories } from '@/types';

// Public GET for published and approved posts
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const categories = searchParams.getAll('category');

        const query: any = { status: 'published', approvalStatus: 'Approved' };

        if (categories.length > 0) {
            query.category = { $in: categories };
        }

        const posts = await BlogPostModel.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: posts.map(p => p.toObject()) });
    } catch (error) {
        console.error("API Error fetching blog posts:", error);
        return NextResponse.json({ success: false, error: 'Server error while fetching posts.' }, { status: 500 });
    }
}

const generateSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') + `-${Date.now()}`;
};

const CreateBlogPostSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long."),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters long."),
    content: z.string().min(50, "Content must be at least 50 characters long."),
    imageUrl: z.string().url("Image URL must be a valid URL."),
    dataAiHint: z.string().optional(),
    category: z.enum(blogCategories),
    author: z.string().optional(),
    tags: z.string().optional(),
    status: z.enum(['draft', 'published']),
});

export async function POST(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    const userName = request.headers.get('x-user-name');
    const userRole = request.headers.get('x-user-role');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const validation = CreateBlogPostSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
        }

        const { tags, ...postData } = validation.data;
        const newPost = await BlogPostModel.create({
            ...postData,
            slug: generateSlug(postData.title),
            author: postData.author || userName || 'Anonymous',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            submittedBy: new mongoose.Types.ObjectId(userId),
            approvalStatus: (userRole === 'admin' || userRole === 'agent') ? 'Approved' : 'Pending',
        });

        return NextResponse.json({ success: true, data: newPost.toObject() }, { status: 201 });
    } catch (error) {
        console.error("API Error creating blog post:", error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
