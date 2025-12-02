import { withAdmin } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Schema for query params
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get and validate query params
    const query = getQuery(event)
    const params = querySchema.parse(query)

    // Build where clause for search
    const where = params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' as const } },
            { color: { contains: params.search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true,
          _count: {
            select: {
              reviews: true,
              payments: true
            }
          },
          stars: true
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ])

    // Transform products for response
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      price: product.price.toString(),
      category: {
        id: product.category.id,
        name: product.category.name
      },
      images: product.images.map(img => ({
        id: img.id,
        url: img.url
      })),
      stats: {
        reviewCount: product._count.reviews,
        orderCount: product._count.payments,
        averageRating: product.stars[0] 
          ? (product.stars[0].receivedStars / (product._count.reviews || 1)).toFixed(1)
          : '0'
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))

    // Return products with pagination
    return {
      success: true,
      data: {
        products: transformedProducts,
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
    console.error('Admin get products error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
