import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { productSchema } from '@/lib/validation/schemas';
import { errorHandler } from '@/middleware/errorHandler';
import { isAdmin } from '@/middleware/auth';

/**
 * GET /api/products
 * Access: Public (Anyone can view products)
 * Use Case: Customers browse products, Admin views product list
 */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query - only show active products
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
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
    console.error('[ERROR] GET /api/products error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * POST /api/products
 * Access: ADMIN ONLY
 * Use Case: Admin creates new product
 * RBAC: Requires admin role
 */
export async function POST(req) {
  try {
    // RBAC CHECK: Only Admin can create products
    const authResult = await isAdmin(req);
    if (authResult.error) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error,
          requiredRole: 'admin',
        },
        { status: authResult.status }
      );
    }

    await connectDB();

    const body = await req.json();

    // Validate product data
    const validatedData = productSchema.parse(body);

    // Create product
    const product = await Product.create({
      ...validatedData,
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
    console.error('[ERROR] POST /api/products error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
