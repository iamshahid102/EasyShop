import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/public/categories
 * Access: PUBLIC (No authentication required)
 * Description: Get all product categories with counts
 */
export async function GET(req) {
  try {
    await connectDB();

    // Get unique categories with product counts
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedCategories = categories.map((cat) => ({
      name: cat._id,
      count: cat.count,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('[ERROR] GET /api/public/categories error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
