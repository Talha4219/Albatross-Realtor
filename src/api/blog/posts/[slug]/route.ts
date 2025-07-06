
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const post = await BlogPostModel.findOne({
      slug: slug,
      status: 'published',
      approvalStatus: 'Approved'
    }).populate('submittedBy', 'name');

    if (!post) {
      return NextResponse.json({ success: false, error: 'Blog post not found or not published' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post.toObject() });
  } catch (error) {
    console.error(`API Error fetching blog post by slug ${slug}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
