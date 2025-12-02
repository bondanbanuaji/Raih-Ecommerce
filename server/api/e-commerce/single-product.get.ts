import { z } from 'zod'
import prisma from '~/server/utils/prisma'

// Schema for single product query
const singleProductSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  slug: z.string().optional()
}).refine(data => data.id || data.slug, {
  message: 'Either id or slug must be provided'
})

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    
    // Validate query params
    const params = singleProductSchema.parse(query)

    // Build where clause
    const where = params.id 
      ? { id: params.id }
      : { slug: params.slug }

    // Get product with all related data
    const product = await prisma.product.findFirst({
      where,
      include: {
        category: true,
        images: true,
        stars: true,
        starPercents: {
          orderBy: {
            star: 'desc'
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    // Check if product exists
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Calculate average rating
    const avgRating = product.stars[0] 
      ? (product.stars[0].receivedStars / (product._count.reviews || 1))
      : 0

    // Calculate rating distribution percentages
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const starData = product.starPercents.find(sp => sp.star === star)
      const percentage = starData && product._count.reviews > 0
        ? Math.round((starData.times / product._count.reviews) * 100)
        : 0
      return {
        star,
        count: starData?.times || 0,
        percentage
      }
    })

    // Transform product for response
    const transformedProduct = {
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
      rating: {
        average: avgRating.toFixed(1),
        totalReviews: product._count.reviews,
        totalStars: product.stars[0]?.receivedStars || 0,
        distribution: ratingDistribution
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    // Return product data
    return {
      success: true,
      data: transformedProduct
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
    console.error('Get single product error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch product'
    })
  }
})
