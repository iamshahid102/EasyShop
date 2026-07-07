import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';
import connectDB from '@/lib/db/mongodb';

/**
 * Protect Routes - Verify JWT Token
 * Use: Any route that requires authentication
 */
export const protect = async (req) => {
  let token;

  try {
    // Method 1: Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    // Method 2: Get token from cookies (fallback)
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get('token')?.value;
      } catch (err) {
        // Cookies might not be available in some contexts
      }
    }

    if (!token) {
      return {
        error: 'Not authorized, no token provided',
        status: 401
      };
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('[ERROR] JWT_SECRET is not defined in environment variables');
      return {
        error: 'Server configuration error',
        status: 500
      };
    }

    await connectDB();

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return {
        error: 'User not found or token is invalid',
        status: 401
      };
    }

    return { user };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return {
        error: 'Invalid token',
        status: 401
      };
    }
    if (error.name === 'TokenExpiredError') {
      return {
        error: 'Token expired, please login again',
        status: 401
      };
    }
    return {
      error: 'Authorization failed: ' + error.message,
      status: 401
    };
  }
};

/**
 * Admin Only Routes
 * Use: Routes that only admins can access (Product CRUD, Order Management)
 */
export const isAdmin = async (req) => {
  try {
    const authResult = await protect(req);

    // If authentication failed, return the error
    if (authResult.error) {
      return authResult;
    }

    // Check if user has admin role
    if (authResult.user.role !== 'admin') {
      return {
        error: 'Access denied. Admin privileges required.',
        status: 403
      };
    }

    return { user: authResult.user };
  } catch (error) {
    console.error('[ERROR] Admin Check Error:', error);
    return {
      error: 'Authorization check failed',
      status: 500
    };
  }
};

/**
 * Customer Only Routes
 * Use: Routes that only customers can access
 */
export const isCustomer = async (req) => {
  try {
    const authResult = await protect(req);

    if (authResult.error) {
      return authResult;
    }

    // Only allow users with 'user' role
    if (authResult.user.role !== 'user') {
      return {
        error: 'Access denied. This action is for customers only.',
        status: 403
      };
    }

    return { user: authResult.user };
  } catch (error) {
    return {
      error: 'Authorization check failed',
      status: 500
    };
  }
};

/**
 * Verify Resource Ownership
 * Use: Ensure user can only access their own resources (cart, orders)
 */
export const verifyOwnership = (resourceUserId, requestUserId) => {
  try {
    if (resourceUserId.toString() !== requestUserId.toString()) {
      return {
        error: 'Access denied. You can only access your own resources.',
        status: 403
      };
    }
    return { authorized: true };
  } catch (error) {
    return {
      error: 'Ownership verification failed',
      status: 500
    };
  }
};

/**
 * Check Multiple Roles
 * Use: Routes accessible by multiple roles
 */
export const hasRole = async (req, allowedRoles = []) => {
  try {
    const authResult = await protect(req);

    if (authResult.error) {
      return authResult;
    }

    if (!allowedRoles.includes(authResult.user.role)) {
      return {
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        status: 403
      };
    }

    return { user: authResult.user };
  } catch (error) {
    return {
      error: 'Role check failed',
      status: 500
    };
  }
};
