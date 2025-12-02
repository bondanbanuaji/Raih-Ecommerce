import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get distinct colors from products
    const products = await prisma.product.findMany({
      select: {
        color: true
      },
      distinct: ['color']
    })

    // Extract unique colors
    const colors = products
      .map(p => p.color)
      .filter(Boolean)
      .sort()

    // Count products for each color
    const colorsWithCount = await Promise.all(
      colors.map(async (color) => {
        const count = await prisma.product.count({
          where: { color }
        })
        return {
          name: color,
          count
        }
      })
    )

    // Return colors
    return {
      success: true,
      data: {
        colors: colorsWithCount,
        total: colorsWithCount.length
      }
    }

  } catch (error: any) {
    // Handle unexpected errors
    console.error('Get colors error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch colors'
    })
  }
})
