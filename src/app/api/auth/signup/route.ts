
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.json({ success: false, error: "Server configuration error." }, { status: 500 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = SignupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid input data.", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      // role will default to 'user' from schema
    });

    await newUser.save();
    const userObject = newUser.toObject(); 

    const token = jwt.sign(
      { userId: userObject.id, email: userObject.email, name: userObject.name, role: userObject.role }, // Include role in JWT
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
