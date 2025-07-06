
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.json({ success: false, error: "Server configuration error: JWT secret not set." }, { status: 500 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid input data.", details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const userObject = user.toObject(); 

    const token = jwt.sign(
      { userId: user._id.toString(), email: userObject.email, name: userObject.name, role: userObject.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    if (!token) {
        console.error("Login API Error: JWT token generation resulted in a falsy value. Check JWT_SECRET and payload.", {userId: user._id.toString(), email: userObject.email, name: userObject.name});
        return NextResponse.json({ success: false, error: "Token generation failed internally." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { user: userObject, token: token } }, { status: 200 });

  } catch (error) {
    console.error("Login API Error:", error);
    let errorMessage = 'An unknown error occurred during login.';
     if (error instanceof Error) {
        errorMessage = error.message;
    }
    if (errorMessage.includes("MONGODB_URI")) {
      return NextResponse.json({ success: false, error: "Database configuration error. Please check server environment variables." }, { status: 500 });
    }
    if (errorMessage.includes("secretOrPrivateKey") || errorMessage.includes("invalid algorithm")) {
        return NextResponse.json({ success: false, error: "Server configuration error: Problem with JWT secret or algorithm." }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
