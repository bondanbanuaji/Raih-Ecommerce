import { z } from 'zod'

// User registration schema
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
})

// User login schema
export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// OTP verification schema
export const otpSchema = z.object({
  email: z.string().email('Invalid email format'),
  otpCode: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers')
})

// Product schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  color: z.string().min(1, 'Color is required'),
  price: z.number().positive('Price must be positive').or(z.string().transform((val) => parseFloat(val))),
  categoryId: z.number().positive('Category is required').or(z.string().transform((val) => parseInt(val)))
})

// Product update schema (all fields optional)
export const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  price: z.number().positive().or(z.string().transform((val) => parseFloat(val))).optional(),
  categoryId: z.number().positive().or(z.string().transform((val) => parseInt(val))).optional()
})

// Category schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long')
})

// Review schema
export const reviewSchema = z.object({
  userId: z.number().positive('User ID is required'),
  productId: z.number().positive('Product ID is required'),
  starNumber: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment too long')
})

// Payment schema
export const paymentSchema = z.object({
  userData: z.object({
    id: z.number().positive(),
    name: z.string(),
    email: z.string().email()
  }),
  productData: z.array(z.object({
    id: z.number().positive(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive().int()
  })),
  totalPrice: z.number().positive('Total price must be positive')
})

// Filter schema for product listing
export const productFilterSchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.number()).optional(),
  colors: z.array(z.string()).optional(),
  prices: z.array(z.number()).length(2).optional(), // [min, max]
  starRating: z.number().min(1).max(5).optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(50).default(10)
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().positive().default(1).or(z.string().transform((val) => parseInt(val))),
  limit: z.number().positive().max(100).default(10).or(z.string().transform((val) => parseInt(val)))
})
