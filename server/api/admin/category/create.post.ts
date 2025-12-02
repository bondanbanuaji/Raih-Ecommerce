import { withAdmin } from '~/server/utils/auth.middleware'
import { categorySchema } from '~/server/utils/validationSchemas'
import prisma, { handlePrismaError } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get request body
    const body = await readBody(event)

    // Validate input
    const validatedData = categorySchema.parse(body)

    // Check if category name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name }
    })

    if (existingCategory) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category name already exists'
      })
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name: validatedData.name
      }
    })

    // Return success response
    return {
      success: true,
      message: 'Category created successfully',
      data: {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt
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
    console.error('Create category error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create category'
    })
  }
})
