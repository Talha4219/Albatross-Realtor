
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ success: false, error: 'Unauthorized or Invalid User ID' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const propertyType = searchParams.get('type');
    const query: any = { submittedBy: new mongoose.Types.ObjectId(userId) };
    if (propertyType) {
      query.propertyType = propertyType;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: properties.map(p => p.toObject()) });
  } catch (error) {
    console.error(`API Error fetching properties for user ${userId}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
