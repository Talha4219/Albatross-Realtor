
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel from '@/models/Project';
import mongoose from 'mongoose';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@albatrossrealtor.com';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserEmail = request.headers.get('x-user-email');
  if (requestingUserEmail !== ADMIN_EMAIL) {
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

// Placeholder for PUT (Update) - to be implemented if "Edit" functionality is added
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   // ... implementation ...
// }
