import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { protect, isAdmin } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/orders
 * Access: CUSTOMER (own orders) | ADMIN (all orders)
 * Use Case: Customer views their orders, Admin views all orders
 * RBAC: Customers see only their orders, Admin sees all
 */
export async function GET(req) {
  try {
    // RBAC CHECK: Must be authenticated
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // RBAC: Admin sees all orders, Customer sees only their own
    const query =
      authResult.user.role === 'admin'
        ? {} // Admin gets all orders
        : { user: authResult.user._id }; // Customer gets only their orders

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      role: authResult.user.role, // Include role in response for frontend
    });
  } catch (error) {
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * POST /api/orders
 * Access: CUSTOMER ONLY
 * Use Case: Customer places an order from their cart
 * RBAC: Only authenticated customers can create orders
 */
export async function POST(req) {
  try {
    // RBAC CHECK: Must be authenticated customer
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    // RBAC: Admin cannot place orders (business logic)
    if (authResult.user.role === 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Admins cannot place orders. Please use a customer account.',
        },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { shippingAddress, paymentMethod } = body;

    // Get user's cart
    const cart = await Cart.findOne({ user: authResult.user._id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty. Add items before placing order.' },
        { status: 400 }
      );
    }

    // Verify stock availability for all items
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${item.product?.name || 'Unknown'}" is no longer available`,
          },
          { status: 400 }
        );
      }

      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0]?.url || '',
      quantity: item.quantity,
      price: item.price,
    }));

    // Calculate prices
    const subtotal = cart.subtotal;
    const tax = cart.tax;
    const shippingPrice = subtotal > 1500 ? 0 : 150; // Free shipping over Rs. 1500
    const totalPrice = subtotal + tax + shippingPrice;

    // Create order
    const order = await Order.create({
      user: authResult.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'cod' ? false : false, // Will be updated after payment
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    cart.items = [];
    await cart.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully',
        data: order,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
