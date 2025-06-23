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


// Helper to generate a unique slug
const generateSlug = (title: string) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${baseSlug}-${Date.now()}`;
};

// Zod schema for creating a new blog post
const CreateBlogPostSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long."),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters long."),
    content: z.string().min(50, "Content must be at least 50 characters long."),
    imageUrl: z.string().url("Image URL must be a valid URL."),
    dataAiHint: z.string().optional(),
    category: z.enum(blogCategories),
    author: z.string().optional(), // User's name will be passed here
    tags: z.string().optional(),
    status: z.enum(['draft', 'published']), // User can save as draft
});

// POST a new blog post (by any authenticated user)
export async function POST(request: NextRequest) {
    const userId = request.headers.get('x-user-id');
    const userName = request.headers.get('x-user-name');
    const userRole = request.headers.get('x-user-role');

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Forbidden: Authentication required' }, { status: 403 });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Invalid user ID format from token." }, { status: 400 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        
        const validation = CreateBlogPostSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
        }

        const { tags, ...postData } = validation.data;
        
        const slug = generateSlug(postData.title);

        const newPostData: any = {
            ...postData,
            slug,
            author: postData.author || userName || 'Anonymous',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            submittedBy: new mongoose.Types.ObjectId(userId),
        };

        // If an admin posts, auto-approve it. Otherwise, it's pending.
        if (userRole === 'admin') {
            newPostData.approvalStatus = 'Approved';
        } else {
            newPostData.approvalStatus = 'Pending';
        }

        const newPost = await BlogPostModel.create(newPostData);
        
        return NextResponse.json({ success: true, data: newPost.toObject() }, { status: 201 });

    } catch (error) {
        console.error("API Error creating blog post:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ success: false, error: 'Validation Error', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: 'Server error while creating post.' }, { status: 500 });
    }
}
