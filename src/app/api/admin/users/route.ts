

import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { UserProfile } from '@/types';

const ADMIN_ROLE = 'admin';
const PAGE_SIZE = 10; // Number of users per page

export async function GET(request: NextRequest) {
  const requestingUserRole = request.headers.get('x-user-role');

  if (requestingUserRole !== ADMIN_ROLE) {
    return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get('search');
  const roleQuery = searchParams.get('role');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || String(PAGE_SIZE), 10);

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

    if (roleQuery) {
      query.role = roleQuery;
    }

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const usersFromDb = await User.find(query)
                                  .sort({ createdAt: -1 })
                                  .skip(skip)
                                  .limit(limit);

    const users: UserProfile[] = usersFromDb.map(userDoc => {
      const userObject = userDoc.toObject();
      return {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        role: userObject.role,
        createdAt: userObject.createdAt ? new Date(userObject.createdAt).toISOString() : undefined,
        updatedAt: userObject.updatedAt ? new Date(userObject.updatedAt).toISOString() : undefined,
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        pageSize: limit,
      }
    }, { status: 200 });

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
