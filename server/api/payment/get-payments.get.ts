import { withAuth, getAuthUser } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Schema for query params
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
})

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user
    await withAuth(event)
    const authUser = getAuthUser(event)
    
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    // Get and validate query params
    const query = getQuery(event)
    const params = querySchema.parse(query)

    // Get user's payments with pagination
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where: {
          userId: authUser.id
        },
        include: {
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
      prisma.payment.count({
        where: {
          userId: authUser.id
        }
      })
    ])

    // Transform payments for response
    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount.toString(),
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

    // Calculate total spent
    const totalSpent = await prisma.payment.aggregate({
      where: {
        userId: authUser.id
      },
      _sum: {
        amount: true
      }
    })

    // Return payments with pagination info
    return {
      success: true,
      data: {
        payments: transformedPayments,
        totalSpent: totalSpent._sum.amount?.toString() || '0',
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
    console.error('Get payments error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch payment history'
    })
  }
})
