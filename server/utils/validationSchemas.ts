import { z } from 'zod'

// Auth Schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export const emailVerificationSchema = z.object({
  email: z.string().email('Invalid email format'),
  otpCode: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only digits')
})

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name too long'),
  color: z.string().min(1, 'Color is required').max(50, 'Color name too long'),
  price: z.number().positive('Price must be positive').multipleOf(0.01, 'Price must have at most 2 decimal places'),
  categoryId: z.number().int().positive('Valid category ID required')
})

export const updateProductSchema = productSchema.partial()

// Category Schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long')
})

export const updateCategorySchema = categorySchema.partial()

// Review Schemas
export const reviewSchema = z.object({
  userId: z.number().int().positive('Valid user ID required'),
  productId: z.number().int().positive('Valid product ID required'),
  starNumber: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(1, 'Comment is required').max(1000, 'Comment too long')
})

// Payment Schemas
export const createPaymentSchema = z.object({
  userData: z.object({
    id: z.number().int().positive('Valid user ID required'),
    name: z.string().optional(),
    email: z.string().email('Invalid email format')
  }),
  productData: z.array(z.object({
    id: z.number().int().positive('Valid product ID required'),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive('Quantity must be positive'),
    totalProductPrice: z.number().positive()
  })).min(1, 'At least one product required'),
  totalPrice: z.number().positive('Total price must be positive')
})

// Filter/Query Schemas
export const productFilterSchema = z.object({
  search: z.string().optional(),
  categories: z.array(z.coerce.number()).optional(),
  colors: z.array(z.string()).optional(),
  prices: z.array(z.coerce.number()).length(2).optional(), // [min, max]
  starRating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
})

// Image Upload Schema
export const imageUploadSchema = z.object({
  productId: z.number().int().positive('Valid product ID required').optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image required')
})

// User Update Schema
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'CUSTOMER']).optional()
})

// Refresh Token Schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

// Type exports for TypeScript
export type SignupInput = z.infer<typeof signupSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>
export type ProductInput = z.infer<typeof productSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type ProductFilterInput = z.infer<typeof productFilterSchema>
export type ImageUploadInput = z.infer<typeof imageUploadSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
