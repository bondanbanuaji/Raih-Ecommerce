import { productFilterSchema } from '~/server/utils/validationSchemas'
import prisma from '~/server/utils/prisma'
import type { Prisma } from '../../generated/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    
    // Validate and parse query params
    const filters = productFilterSchema.parse(query)

    // Build where clause for Prisma
    const where: Prisma.ProductWhereInput = {}

    // Search filter
    if (filters.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive'
      }
    }

    // Category filter (multiple categories)
    if (filters.categories && filters.categories.length > 0) {
      where.categoryId = {
        in: filters.categories
      }
    }

    // Color filter (multiple colors)
    if (filters.colors && filters.colors.length > 0) {
      where.color = {
        in: filters.colors
      }
    }

    // Price range filter
    if (filters.prices && filters.prices.length === 2) {
      const [min, max] = filters.prices
      where.price = {
        gte: min,
        lte: max
      }
    }

    // Get products with filters (without star rating filter first)
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          take: 1 // Get only first image for listing
        },
        stars: true,
        _count: {
          select: {
            reviews: true
          }
        }
      },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Filter by star rating if specified (post-query filtering)
    let filteredProducts = products
    if (filters.starRating) {
      filteredProducts = products.filter(product => {
        if (!product.stars[0]) return false
        const avgRating = product.stars[0].receivedStars / (product._count.reviews || 1)
        return Math.floor(avgRating) === filters.starRating
      })
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })

    // Transform products for response
    const transformedProducts = filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      price: product.price.toString(),
      category: {
        id: product.category.id,
        name: product.category.name
      },
      image: product.images[0]?.url || process.env.FALL_BACK_IMG_URL || '/placeholder.jpg',
      rating: product.stars[0] 
        ? (product.stars[0].receivedStars / (product._count.reviews || 1)).toFixed(1)
        : '0',
      reviewCount: product._count.reviews
    }))

    // Return products with pagination info
    return {
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          total: totalCount,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(totalCount / filters.limit)
        }
      }
    }

  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Invalid filter parameters'
      })
    }

    // Handle unexpected errors
    console.error('Get products error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
