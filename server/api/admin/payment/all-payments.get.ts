import { withAdmin } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Schema for query params
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  userId: z.coerce.number().int().positive().optional(),
  productId: z.coerce.number().int().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get and validate query params
    const query = getQuery(event)
    const params = querySchema.parse(query)

    // Build where clause for filtering
    const where: any = {}
    
    if (params.userId) {
      where.userId = params.userId
    }
    
    if (params.productId) {
      where.productId = params.productId
    }
    
    if (params.startDate || params.endDate) {
      where.createdAt = {}
      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate)
      }
      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate)
      }
    }

    // Get all payments with pagination
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          product: {
            include: {
              category: true,
              images: {
                take: 1
              }
            }
          }
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.payment.count({ where })
    ])

    // Calculate total revenue
    const totalRevenue = await prisma.payment.aggregate({
      where,
      _sum: {
        amount: true
      }
    })

    // Transform payments for response
    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount.toString(),
      user: {
        id: payment.user.id,
        email: payment.user.email,
        name: payment.user.name || 'N/A'
      },
      product: {
        id: payment.product.id,
        name: payment.product.name,
        slug: payment.product.slug,
        color: payment.product.color,
        price: payment.product.price.toString(),
        category: payment.product.category.name,
        image: payment.product.images[0]?.url || process.env.FALL_BACK_IMG_URL
      },
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    }))

    // Return payments with pagination and stats
    return {
      success: true,
      data: {
        payments: transformedPayments,
        stats: {
          totalRevenue: totalRevenue._sum.amount?.toString() || '0',
          totalTransactions: totalCount,
          averageOrderValue: totalCount > 0 
            ? ((totalRevenue._sum.amount || 0) / totalCount).toFixed(2)
            : '0'
        },
        pagination: {
          total: totalCount,
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(totalCount / params.limit)
        }
      }
    }

  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Invalid query parameters'
      })
    }

    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Admin get payments error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch payments'
    })
  }
})
