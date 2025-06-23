
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { UserProfile } from '@/types';

const ADMIN_ROLE = 'admin';

export async function GET(request: NextRequest) {
  const requestingUserRole = request.headers.get('x-user-role');

  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search');

  try {
    await dbConnect();
    
    const query: any = {};
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
      query.$or = [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
      ];
    }

    const usersFromDb = await User.find(query).sort({ createdAt: -1 });

    const users: UserProfile[] = usersFromDb.map(userDoc => {
      const userObject = userDoc.toObject();
      // Ensure the object matches UserProfile structure
      return {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        role: userObject.role,
        createdAt: userObject.createdAt ? new Date(userObject.createdAt).toISOString() : undefined,
        updatedAt: userObject.updatedAt ? new Date(userObject.updatedAt).toISOString() : undefined,
      };
    });

    return NextResponse.json({ success: true, data: users }, { status: 200 });

  } catch (error) {
    console.error("API Error fetching users:", error);
    let errorMessage = 'An unknown error occurred while fetching users.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (errorMessage.includes("MONGODB_URI")) {
      errorMessage = "Database configuration error. Please check server environment variables.";
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
