
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel from '@/models/Project';
import mongoose from 'mongoose';
import { z } from 'zod';

const ADMIN_ROLE = 'admin';

// Schema for updating a project, all fields are optional
const UpdateProjectSchema = z.object({
  name: z.string().min(3).optional(),
  location: z.string().min(3).optional(),
  developer: z.string().min(2).optional(),
  imageUrl: z.string().url().optional(),
  dataAiHint: z.string().optional(),
  description: z.string().optional(),
  keyHighlights: z.array(z.string().min(1)).min(1).optional(),
  amenities: z.array(z.string().min(1)).optional(),
  status: z.enum(['Upcoming', 'Trending', 'Launched']).optional(),
  timeline: z.string().optional(),
  learnMoreLink: z.string().url().optional(),
});


// GET handler to fetch a single project by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserRole = request.headers.get('x-user-role');
  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid project ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const project = await ProjectModel.findById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project.toObject() });
  } catch (error) {
    console.error(`API Error fetching project ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// PUT handler to update a project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserRole = request.headers.get('x-user-role');
  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid project ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const validation = UpdateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid data', details: validation.error.flatten() }, { status: 400 });
    }

    const updatedProject = await ProjectModel.findByIdAndUpdate(id, validation.data, { new: true });

    if (!updatedProject) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProject.toObject() });
  } catch (error) {
    console.error(`API Error updating project ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserRole = request.headers.get('x-user-role');
  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid project ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const projectToDelete = await ProjectModel.findById(id);

    if (!projectToDelete) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    await ProjectModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Project deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`API Error deleting project ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
