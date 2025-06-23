
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel from '@/models/Project';
import type { Project as ProjectType } from '@/types';

// This is a public endpoint to fetch projects for display on the homepage or other public pages.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    await dbConnect();

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const projectsFromDb = await ProjectModel.find(query)
      .sort({ createdAt: -1 }); // Show newest first

    const projects: ProjectType[] = projectsFromDb.map(projDoc => projDoc.toObject() as ProjectType);

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching public projects:", error);
    let errorMessage = 'An unknown error occurred while fetching projects.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
