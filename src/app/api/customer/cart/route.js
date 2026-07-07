import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { isCustomer } from '@/middleware/auth';
import { errorHandler } from '@/middleware/errorHandler';

/**
 * GET /api/customer/cart
 * Access: CUSTOMER ONLY
 * Description: Get customer's cart with all items
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

    // Find customer's cart
    let cart = await Cart.findOne({ user: authResult.user._id }).populate(
      'items.product',
      'name price images stock isActive'
    );

    // Create empty cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: authResult.user._id,
        items: [],
      });
    }

    // Filter out inactive products
    cart.items = cart.items.filter((item) => item.product && item.product.isActive);
    await cart.save();

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('[ERROR] GET /api/customer/cart error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * POST /api/customer/cart
 * Access: CUSTOMER ONLY
 * Description: Add product to cart
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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate product
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: 'Product not found or unavailable' },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${product.stock} items available in stock`,
        },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: authResult.user._id,
        items: [{ product: productId, quantity, price: product.price }],
      });
    } else {
      // Check if product already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update existing item
        const newQuantity = cart.items[itemIndex].quantity + quantity;

        if (product.stock < newQuantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Cannot add more. Only ${product.stock} items available`,
            },
            { status: 400 }
          );
        }

        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].price = product.price;
      } else {
        // Add new item
        cart.items.push({ product: productId, quantity, price: product.price });
      }

      await cart.save();
    }

    await cart.populate('items.product', 'name price images stock isActive');

    return NextResponse.json({
      success: true,
      message: 'Product added to cart successfully',
      data: cart,
    });
  } catch (error) {
    console.error('[ERROR] POST /api/customer/cart error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * DELETE /api/customer/cart
 * Access: CUSTOMER ONLY
 * Description: Clear entire cart
 */
export async function DELETE(req) {
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

    // Find customer's cart
    const cart = await Cart.findOne({ user: authResult.user._id });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    // Clear all items
    cart.items = [];
    await cart.save();

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    console.error('[ERROR] DELETE /api/customer/cart error:', error);
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
