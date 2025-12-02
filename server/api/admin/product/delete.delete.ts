import { withAdmin } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Schema for delete request
const deleteProductSchema = z.object({
  id: z.coerce.number().int().positive()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get query params
    const query = getQuery(event)

    // Validate input
    const { id } = deleteProductSchema.parse(query)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reviews: true,
            payments: true
          }
        }
      }
    })

    if (!existingProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Optional: Check if product has related data
    if (existingProduct._count.payments > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot delete product with existing orders. Consider archiving instead.'
      })
    }

    // Delete product with cascade (related data will be deleted due to onDelete: Cascade in schema)
    await prisma.$transaction(async (tx) => {
      // Delete related data first (if not using cascade)
      await tx.image.deleteMany({ where: { productId: id } })
      await tx.productReview.deleteMany({ where: { productId: id } })
      await tx.productStar.deleteMany({ where: { productId: id } })
      await tx.productStarPercent.deleteMany({ where: { productId: id } })
      
      // Delete the product
      await tx.product.delete({ where: { id } })
    })

    // Return success response
    return {
      success: true,
      message: 'Product deleted successfully',
      data: {
        id,
        name: existingProduct.name
      }
    }

  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Invalid input data'
      })
    }

    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Delete product error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product'
    })
  }
})
