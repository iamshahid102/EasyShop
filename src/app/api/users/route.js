import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import { isAdmin } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/users
 * Access: ADMIN ONLY
 * Use Case: Admin views all customers/users
 */
export async function GET(req) {
  try {
    // RBAC CHECK: Only Admin can view all users
    const authResult = await isAdmin(req);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
