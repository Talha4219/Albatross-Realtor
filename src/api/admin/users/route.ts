
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { UserProfile } from '@/types';

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const requestingUserRole = request.headers.get('x-user-role');
  if (requestingUserRole !== 'admin') {
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
      const regex = new RegExp(searchQuery, 'i');
      query.$or = [{ name: { $regex: regex } }, { email: { $regex: regex } }];
    }
    if (roleQuery) {
      query.role = roleQuery;
    }

    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const usersFromDb = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const users: UserProfile[] = usersFromDb.map(userDoc => userDoc.toObject() as UserProfile);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: { currentPage: page, totalPages, totalUsers, pageSize: limit }
    }, { status: 200 });

  } catch (error) {
    console.error("API Error fetching users:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
