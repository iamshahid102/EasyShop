import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { isCustomer } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/customer/orders
 * Access: CUSTOMER ONLY
 * Description: Get all orders for the logged-in customer
 */
export async function GET(req) {
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Fetch only customer's own orders
    const orders = await Order.find({ user: authResult.user._id })
      .sort('-createdAt')
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Order.countDocuments({ user: authResult.user._id });

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
    });
  } catch (error) {
    console.error('[ERROR] GET /api/customer/orders error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * POST /api/customer/orders
 * Access: CUSTOMER ONLY
 * Description: Create a new order from cart
 */
export async function POST(req) {
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

    const body = await req.json();
    const { shippingAddress, paymentMethod } = body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Shipping address and payment method are required' },
        { status: 400 }
      );
    }

    // Get customer's cart
    const cart = await Cart.findOne({ user: authResult.user._id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty. Add items before placing order.' },
        { status: 400 }
      );
    }

    // Verify stock for all items
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
      isPaid: paymentMethod === 'cod' ? false : false,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear customer's cart
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
    console.error('[ERROR] POST /api/customer/orders error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
