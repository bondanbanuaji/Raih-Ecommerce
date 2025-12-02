import { withAdmin } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Schema for delete request
const deleteCategorySchema = z.object({
  id: z.coerce.number().int().positive()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get query params
    const query = getQuery(event)

    // Validate input
    const { id } = deleteCategorySchema.parse(query)

    // Check if category exists and has products
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cannot delete category with ${existingCategory._count.products} existing products. Please delete or reassign the products first.`
      })
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    // Return success response
    return {
      success: true,
      message: 'Category deleted successfully',
      data: {
        id,
        name: existingCategory.name
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
    console.error('Delete category error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})
