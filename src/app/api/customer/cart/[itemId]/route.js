import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { isCustomer } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * PUT /api/customer/cart/[itemId]
 * Access: CUSTOMER ONLY
 * Description: Update cart item quantity
 */
export async function PUT(req, { params }) {
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

    const { itemId } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Find customer's cart
    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Check product stock
    const product = await Product.findById(cart.items[itemIndex].product);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: 'Product no longer available' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${product.stock} items available`,
        },
        { status: 400 }
      );
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price; // Update price if changed
    await cart.save();

    await cart.populate('items.product', 'name price images stock isActive');

    return NextResponse.json({
      success: true,
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (error) {
    console.error('[ERROR] PUT /api/customer/cart/[itemId] error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * DELETE /api/customer/cart/[itemId]
 * Access: CUSTOMER ONLY
 * Description: Remove item from cart
 */
export async function DELETE(req, { params }) {
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

    const { itemId } = await params;

    // Find customer's cart
    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    // Find and remove item
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate('items.product', 'name price images stock isActive');

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    console.error('[ERROR] DELETE /api/customer/cart/[itemId] error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
