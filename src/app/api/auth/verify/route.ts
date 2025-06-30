
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    success: false, 
    error: "This verification endpoint is deprecated and no longer in use. User accounts are automatically verified upon signup." 
  }, { status: 410 }); // 410 Gone
}
