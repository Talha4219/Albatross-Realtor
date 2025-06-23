
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';

// This is a public endpoint to fetch a single published blog post
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  
  if (!slug) {
    return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    // Find a post that matches the slug, is 'published', and has been 'Approved'
    const post = await BlogPostModel.findOne({ 
      slug: slug, 
      status: 'published',
      approvalStatus: 'Approved' 
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found or is not published' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post.toObject() }, { status: 200 });
  } catch (error) {
    console.error(`API Error fetching blog post by slug ${slug}:`, error);
    let errorMessage = 'An unknown error occurred while fetching the blog post.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
