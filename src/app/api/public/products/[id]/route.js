import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/public/products/[id]
 * Access: PUBLIC (No authentication required)
 * Description: Get single product details for product page
 */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findOne({
      _id: id,
      isActive: true, // Only show active products
    })
      .select('-createdBy -__v')
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('[ERROR] GET /api/public/products/[id] error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
