
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import type { Agent } from '@/types';

// Public endpoint to fetch a single agent's profile
export async function GET(request: NextRequest, { params }: { params: { agentId: string } }) {
  const { agentId } = params;

  if (!mongoose.Types.ObjectId.isValid(agentId)) {
    return NextResponse.json({ success: false, error: 'Invalid agent ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const agentDoc = await User.findOne({ _id: agentId, role: 'agent' });

    if (!agentDoc) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    const userObject = agentDoc.toObject();
    
    // Construct the Agent object based on the User model and additional mock data
    const agent: Agent = {
      id: userObject.id,
      name: userObject.name,
      email: userObject.email,
      role: userObject.role,
      profilePictureUrl: userObject.profilePictureUrl,
      phone: userObject.phone,
      isVerified: true, // All agents fetched via this API are considered verified
      // NOTE: Specialty and rating are not in the User model.
      // They are added here for demonstration purposes.
      specialty: 'Residential & Commercial',
      rating: 4.8, 
    };

    return NextResponse.json({ success: true, data: agent });

  } catch (error) {
    console.error(`API Error fetching agent ${agentId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
