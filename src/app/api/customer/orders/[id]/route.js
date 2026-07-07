import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { isCustomer } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/customer/orders/[id]
 * Access: CUSTOMER ONLY
 * Description: Get specific order details (only own orders)
 */
export async function GET(req, { params }) {
  try {
    // Authenticate customer
    const authResult = await isCustomer(req);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { id } = await params;

    // Find order belonging to this customer only
    const order = await Order.findOne({
      _id: id,
      user: authResult.user._id, // Ensure customer can only see their own orders
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('[ERROR] GET /api/customer/orders/[id] error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
