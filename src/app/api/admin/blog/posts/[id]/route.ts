
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { z } from 'zod';
import mongoose from 'mongoose';

const ADMIN_ROLE = 'admin';

// Reusable slug generator (from POST route)
const generateSlug = (title: string, id: string) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  // Use a portion of the ID to ensure uniqueness on update
  return `${baseSlug}-${id.substring(0, 6)}`;
};

const UpdateBlogPostSchema = z.object({
    title: z.string().min(5).optional(),
    excerpt: z.string().min(10).optional(),
    content: z.string().min(50).optional(),
    imageUrl: z.string().url().optional(),
    dataAiHint: z.string().optional(),
    category: z.string().min(2).optional(),
    author: z.string().optional(),
    tags: z.string().optional(), // Comma-separated string
    status: z.enum(['draft', 'published']).optional(),
});

const UpdateStatusSchema = z.object({
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected']),
});


// GET a single post (for editing)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    if (request.headers.get('x-user-role') !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        await dbConnect();
        const post = await BlogPostModel.findById(params.id);
        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: post.toObject() });
    } catch (error) {
        console.error(`API Error fetching blog post ${params.id}:`, error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

// PUT (update) a post
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    if (request.headers.get('x-user-role') !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }
    
    try {
        await dbConnect();
        const body = await request.json();
        const validation = UpdateBlogPostSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
        }

        const { tags, title, ...updateData } = validation.data;
        const finalUpdateData: any = { ...updateData };

        if (tags) {
            finalUpdateData.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }

        if (title) {
            finalUpdateData.title = title;
            finalUpdateData.slug = generateSlug(title, params.id);
        }
        
        const updatedPost = await BlogPostModel.findByIdAndUpdate(params.id, finalUpdateData, { new: true });

        if (!updatedPost) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: updatedPost.toObject() });

    } catch (error) {
        console.error(`API Error updating blog post ${params.id}:`, error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}


// DELETE a post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    if (request.headers.get('x-user-role') !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ success: false, error: 'Invalid post ID format' }, { status: 400 });
    }

    try {
        await dbConnect();
        const deletedPost = await BlogPostModel.findByIdAndDelete(params.id);

        if (!deletedPost) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Post deleted successfully' });

    } catch (error) {
        console.error(`API Error deleting post ${params.id}:`, error);
        return NextResponse.json({ success: false, error: 'Server error while deleting post.' }, { status: 500 });
    }
}

// PATCH to update approval status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    if (request.headers.get('x-user-role') !== ADMIN_ROLE) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        await dbConnect();
        const body = await request.json();
        const validation = UpdateStatusSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
        }

        const { approvalStatus } = validation.data;
        
        const updatedPost = await BlogPostModel.findByIdAndUpdate(
            params.id, 
            { approvalStatus }, 
            { new: true }
        ).populate('submittedBy', 'name email');

        if (!updatedPost) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: updatedPost.toObject() });

    } catch (error) {
        console.error(`API Error updating blog post status ${params.id}:`, error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
