import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { loginSchema } from '@/lib/validation/schemas';
import { generateToken, setTokenCookie } from '@/lib/auth/jwt';
import { errorHandler } from '@/middleware/errorHandler';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate request body
    const validatedData = loginSchema.parse(body);

    // Find user and include password field
    const user = await User.findOne({ email: validatedData.email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(validatedData.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

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
        message: 'Login successful',
        data: { user: userData, token },
      },
      { status: 200 }
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
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
