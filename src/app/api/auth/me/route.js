import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/auth/me
 * Get current authenticated user from cookie
 */
export async function GET(req) {
  try {
    // Get token from cookie OR Authorization header
    let token = req.cookies.get('token')?.value;

    // If no cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      // Clear invalid token
      const response = NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
      response.cookies.delete('token');
      return response;
    }

    await connectDB();

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      const response = NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
