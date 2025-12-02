import { withAdmin } from '~/server/utils/auth.middleware'
import { updateCategorySchema } from '~/server/utils/validationSchemas'
import prisma, { handlePrismaError } from '~/server/utils/prisma'
import { z } from 'zod'

// Extended schema with ID
const updateCategoryWithIdSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100).optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get request body
    const body = await readBody(event)

    // Validate input
    const validatedData = updateCategoryWithIdSchema.parse(body)

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: validatedData.id }
    })

    if (!existingCategory) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    // If name is provided and different, check for uniqueness
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findUnique({
        where: { name: validatedData.name }
      })

      if (duplicateCategory) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Category name already exists'
        })
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.name && { name: validatedData.name })
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    // Return success response
    return {
      success: true,
      message: 'Category updated successfully',
      data: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        productCount: updatedCategory._count.products,
        updatedAt: updatedCategory.updatedAt
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

    // Handle Prisma errors
    if (error.code && error.code.startsWith('P')) {
      const prismaError = handlePrismaError(error)
      throw createError({
        statusCode: prismaError.statusCode,
        statusMessage: prismaError.message
      })
    }

    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Update category error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category'
    })
  }
})
