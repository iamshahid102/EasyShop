import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { isAdmin } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/admin/orders/[id]
 * Access: ADMIN ONLY
 * Description: Get any order details
 */
export async function GET(req, { params }) {
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

    const { id } = await params;

    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .lean();

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
    console.error('[ERROR] GET /api/admin/orders/[id] error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * PUT /api/admin/orders/[id]
 * Access: ADMIN ONLY
 * Description: Update order status, tracking number, etc.
 */
export async function PUT(req, { params }) {
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

    const { id } = await params;
    const body = await req.json();
    const { status, trackingNumber, isPaid } = body;

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (typeof isPaid === 'boolean') updateData.isPaid = isPaid;

    // Update delivered date if status is delivered
    if (status === 'delivered' && !updateData.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('[ERROR] PUT /api/admin/orders/[id] error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
