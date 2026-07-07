/**
 * RBAC Configuration
 * Defines permissions for each role in the system
 */

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'user',
};

export const PERMISSIONS = {
  // Product Permissions
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Cart Permissions
  CART_READ: 'cart:read',
  CART_CREATE: 'cart:create',
  CART_UPDATE: 'cart:update',
  CART_DELETE: 'cart:delete',

  // Order Permissions
  ORDER_READ: 'order:read',
  ORDER_CREATE: 'order:create',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_READ_ALL: 'order:read:all', // Admin only

  // User Permissions
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_READ_ALL: 'user:read:all', // Admin only
};

/**
 * Role-Permission Mapping
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Products - Full CRUD
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,

    // Orders - Can view all orders and update status
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_READ_ALL,
    PERMISSIONS.ORDER_UPDATE,

    // Users - Can view all users
    PERMISSIONS.USER_READ_ALL,
  ],

  [ROLES.CUSTOMER]: [
    // Products - Read Only
    PERMISSIONS.PRODUCT_READ,

    // Cart - Full CRUD (own cart only)
    PERMISSIONS.CART_READ,
    PERMISSIONS.CART_CREATE,
    PERMISSIONS.CART_UPDATE,
    PERMISSIONS.CART_DELETE,

    // Orders - Can create and view own orders
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,

    // User - Can update own profile
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
