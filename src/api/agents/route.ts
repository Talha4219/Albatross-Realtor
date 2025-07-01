
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import type { Agent } from '@/types';

// Public endpoint to fetch all agents
export async function GET() {
  try {
    await dbConnect();
    const agentsFromDb = await User.find({ role: 'agent' }).sort({ createdAt: -1 });

    const agents: Agent[] = agentsFromDb.map(agentDoc => {
      const userObject = agentDoc.toObject();
      return {
        id: userObject.id,
        name: userObject.name,
        email: userObject.email,
        role: userObject.role,
        profilePictureUrl: userObject.profilePictureUrl,
        specialty: userObject.specialty || 'Residential & Commercial', // Use real data, with fallback
        rating: 4.8, // Rating remains mocked for now
        isVerified: true,
      };
    });

    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    console.error("API Error fetching agents:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
