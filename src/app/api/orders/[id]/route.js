import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import { protect, isAdmin } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

// GET single order
export async function GET(req, { params }) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { id } = await params;

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== authResult.user._id.toString() &&
      authResult.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to view this order' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

// PUT update order status (admin only)
export async function PUT(req, { params }) {
  try {
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
    const { status, trackingNumber } = body;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (status) {
      order.status = status;
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
