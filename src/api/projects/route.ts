
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel from '@/models/Project';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  try {
    await dbConnect();
    const query: any = {};
    if (status) query.status = status;
    const projects = await ProjectModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects.map(p => p.toObject()) });
  } catch (error) {
    console.error("API Error fetching public projects:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
