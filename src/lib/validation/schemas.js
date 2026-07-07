import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive('Compare price must be positive').optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sku: z.string().optional(),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    publicId: z.string().optional()
  })).min(1, 'At least one image is required'),
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().min(1),
      price: z.number().positive(),
    })
  ),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['card', 'cod', 'upi', 'netbanking']),
});
