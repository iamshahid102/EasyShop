import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { isAdmin } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/admin/products
 * Access: ADMIN ONLY
 * Description: Get all products with pagination (admin view)
 */
export async function GET(req) {
  try {
    // Authenticate admin
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
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '-createdAt';
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }

    // Fetch products
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate('createdBy', 'name email')
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('[ERROR] GET /api/admin/products error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * POST /api/admin/products
 * Access: ADMIN ONLY
 * Description: Create new product
 */
export async function POST(req) {
  try {
    // Authenticate admin
    const authResult = await isAdmin(req);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const body = await req.json();

    // Create product with admin as creator
    const product = await Product.create({
      ...body,
      createdBy: authResult.user._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ERROR] POST /api/admin/products error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
