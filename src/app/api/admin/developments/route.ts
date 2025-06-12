
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProjectModel from '@/models/Project'; // Use the new Project model
import { z } from 'zod';
import type { Project as ProjectType } from '@/types';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@albatrossrealtor.com';

// Zod schema for creating a new project/development
const CreateProjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  location: z.string().min(3, "Location must be at least 3 characters long."),
  developer: z.string().min(2, "Developer name must be at least 2 characters long."),
  imageUrl: z.string().url("Image URL must be a valid URL.").default('https://placehold.co/600x400.png'),
  dataAiHint: z.string().optional(),
  description: z.string().optional(),
  keyHighlights: z.array(z.string().min(1)).min(1, "At least one key highlight is required."),
  amenities: z.array(z.string().min(1)).optional(),
  isVerified: z.boolean().optional().default(false),
  status: z.enum(['Upcoming', 'Trending', 'Launched']).optional(),
  timeline: z.string().optional(),
  learnMoreLink: z.string().url("Learn more link must be a valid URL.").optional(),
});


export async function GET(request: NextRequest) {
  const requestingUserEmail = request.headers.get('x-user-email');
  if (requestingUserEmail !== ADMIN_EMAIL) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    await dbConnect();
    const projectsFromDb = await ProjectModel.find({}).sort({ createdAt: -1 });

    const projects: ProjectType[] = projectsFromDb.map(projDoc => projDoc.toObject() as ProjectType);

    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching projects:", error);
    let errorMessage = 'An unknown error occurred while fetching projects.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const requestingUserEmail = request.headers.get('x-user-email');
  if (requestingUserEmail !== ADMIN_EMAIL) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = CreateProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
    }

    const projectData = validation.data;
    const newProject = await ProjectModel.create(projectData);
    
    return NextResponse.json({ success: true, data: newProject.toObject() }, { status: 201 });

  } catch (error) {
    console.error("API Error creating project:", error);
    let errorMessage = 'An unknown error occurred while creating the project.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
