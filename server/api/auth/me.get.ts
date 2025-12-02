import { withAuth, getAuthUser } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user
    await withAuth(event)
    
    // Get authenticated user from context
    const authUser = getAuthUser(event)
    
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            payments: true,
            reviews: true
          }
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Return user data
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        totalOrders: user._count.payments,
        totalReviews: user._count.reviews
      }
    }

  } catch (error: any) {
    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Get user error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get user data'
    })
  }
})
