import { z } from 'zod'
import prisma from '~/server/utils/prisma'

// Schema for same category products query
const sameCategorySchema = z.object({
  productId: z.coerce.number().int().positive(),
  limit: z.coerce.number().int().positive().max(20).default(6)
})

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    
    // Validate query params
    const params = sameCategorySchema.parse(query)

    // Get the current product to find its category
    const currentProduct = await prisma.product.findUnique({
      where: { id: params.productId },
      select: { categoryId: true }
    })

    if (!currentProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        NOT: {
          id: params.productId // Exclude current product
        }
      },
      include: {
        category: true,
        images: {
          take: 1 // Get only first image
        },
        stars: true,
        _count: {
          select: {
            reviews: true
          }
        }
      },
      take: params.limit,
      orderBy: {
        createdAt: 'desc' // Show newest products first
      }
    })

    // Transform products for response
    const transformedProducts = relatedProducts.map(product => ({
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

    // Return related products
    return {
      success: true,
      data: {
        products: transformedProducts,
        count: transformedProducts.length
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
    console.error('Get same category products error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch related products'
    })
  }
})
