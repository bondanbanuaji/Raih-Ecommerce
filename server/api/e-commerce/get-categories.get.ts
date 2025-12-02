import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get all categories with product count
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform categories for response
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }))

    // Return categories
    return {
      success: true,
      data: {
        categories: transformedCategories,
        total: transformedCategories.length
      }
    }

  } catch (error: any) {
    // Handle unexpected errors
    console.error('Get categories error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories'
    })
  }
})
