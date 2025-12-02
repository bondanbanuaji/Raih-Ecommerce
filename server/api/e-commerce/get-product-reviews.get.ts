import { z } from 'zod'
import prisma from '~/server/utils/prisma'

// Schema for product reviews query
const productReviewsSchema = z.object({
  productId: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sort: z.enum(['newest', 'oldest', 'highest', 'lowest']).default('newest')
})

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    
    // Validate query params
    const params = productReviewsSchema.parse(query)

    // Build orderBy clause based on sort parameter
    let orderBy: any = { createdAt: 'desc' } // Default: newest first
    
    switch (params.sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'highest':
        orderBy = { starNumber: 'desc' }
        break
      case 'lowest':
        orderBy = { starNumber: 'asc' }
        break
    }

    // Get reviews with pagination
    const reviews = await prisma.productReview.findMany({
      where: {
        productId: params.productId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy,
      skip: (params.page - 1) * params.limit,
      take: params.limit
    })

    // Get total count for pagination
    const totalCount = await prisma.productReview.count({
      where: {
        productId: params.productId
      }
    })

    // Transform reviews for response
    const transformedReviews = reviews.map(review => ({
      id: review.id,
      rating: review.starNumber,
      comment: review.comment,
      user: {
        id: review.user.id,
        name: review.user.name || 'Anonymous',
        // Mask email for privacy (show first 2 chars + domain)
        email: review.user.email.substring(0, 2) + '***@' + review.user.email.split('@')[1]
      },
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }))

    // Return reviews with pagination info
    return {
      success: true,
      data: {
        reviews: transformedReviews,
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

    // Handle unexpected errors
    console.error('Get product reviews error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch reviews'
    })
  }
})
