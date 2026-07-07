import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { registerSchema } from '@/lib/validation/schemas';
import { generateToken, setTokenCookie } from '@/lib/auth/jwt';
import { errorHandler } from '@/middleware/errorHandler';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // SECURITY WARNING: Role assignment from client
    // In production, NEVER allow users to select admin role
    // This is for DEVELOPMENT/TESTING only
    const { name, email, password, role } = body;

    // Validate basic user data
    const validatedData = registerSchema.parse({ name, email, password });

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // PRODUCTION SECURITY: Uncomment this block for production
    // Force all new users to be 'user' role only
    /*
    const userRole = 'user'; // Always user, never admin
    */

    // DEVELOPMENT ONLY: Allow role selection
    // REMOVE THIS IN PRODUCTION!
    const userRole = role === 'admin' ? 'admin' : 'user';

    if (role === 'admin') {
      console.warn('[WARN] Admin role assigned during registration!');
      console.warn('[WARN] This should ONLY happen in development/testing!');
    }

    // Create user with selected role
    const user = await User.create({
      ...validatedData,
      role: userRole,
    });

    // Generate token with role
    const token = generateToken(user._id, user.role);

    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: `User registered successfully as ${userRole}`,
        data: { user: userData, token },
      },
      { status: 201 }
    );

    // Set cookie with proper settings
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
