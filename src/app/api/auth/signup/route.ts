

import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const signupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['user', 'agent'], { required_error: "You must select a role." }),
  phone: z.string().optional(),
}).refine((data) => {
    if (data.role === 'agent') {
        return !!data.phone && data.phone.length > 0;
    }
    return true;
}, {
    message: "Phone number is required for agents.",
    path: ["phone"],
});


const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SUPER_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@albatrossrealtor.com';

export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.json({ success: false, error: "Server configuration error." }, { status: 500 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = signupFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid input data.", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    let { name, email, password, role, phone } = validation.data;
    email = email.toLowerCase();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) { 
      return NextResponse.json({ success: false, error: "User with this email already exists." }, { status: 409 });
    }
    
    // Check if the email matches the super admin email and upgrade the role
    if (email === ADMIN_SUPER_EMAIL.toLowerCase()) {
      role = 'admin';
    }

    const user = new User();

    user.name = name;
    user.email = email;
    user.passwordHash = await bcrypt.hash(password, 10);
    user.role = role;
    user.phone = role === 'agent' ? phone : undefined;
    user.isEmailVerified = true; 

    await user.save();

    const userObject = user.toObject(); 

    const tokenPayload: any = { 
        userId: userObject.id, 
        email: userObject.email, 
        name: userObject.name, 
        role: userObject.role 
    };

    if (userObject.phone) {
        tokenPayload.phone = userObject.phone;
    }

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    return NextResponse.json({ success: true, data: { user: userObject, token: token } }, { status: 201 });

  } catch (error) {
    console.error("Signup API Error:", error);
    let errorMessage = 'An unknown error occurred during signup.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    if (errorMessage.includes("MONGODB_URI")) {
      return NextResponse.json({ success: false, error: "Database configuration error. Please check server environment variables." }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
