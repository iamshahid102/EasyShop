import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { errorHandler } from '@/middleware/errorHandler';
import { isAdmin } from '@/middleware/auth';

/**
 * GET /api/products/[id]
 * Access: Public (Anyone can view single product)
 * Use Case: View product details
 */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const product = await Product.findById(id);

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
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * PUT /api/products/[id]
 * Access: ADMIN ONLY
 * Use Case: Admin updates product details
 * RBAC: Requires admin role
 */
export async function PUT(req, { params }) {
  try {
    // RBAC CHECK: Only Admin can update products
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

    const { id } = await params;
    const body = await req.json();

    // Find and update product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: authResult.user._id, // Track who updated it
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully by admin',
      data: product,
    });
  } catch (error) {
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}

/**
 * DELETE /api/products/[id]
 * Access: ADMIN ONLY
 * Use Case: Admin deletes product
 * RBAC: Requires admin role
 */
export async function DELETE(req, { params }) {
  try {
    // RBAC CHECK: Only Admin can delete products
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

    const { id } = await params;

    // Soft delete - just mark as inactive instead of actually deleting
    const product = await Product.findByIdAndUpdate(
      id,
      {
        isActive: false,
        deletedBy: authResult.user._id,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully by admin',
    });
  } catch (error) {
    const errorResponse = errorHandler(error);
    return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
  }
}
