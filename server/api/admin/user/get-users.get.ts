import { withAdmin } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Schema for query params
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role: z.enum(['ADMIN', 'CUSTOMER']).optional(),
  search: z.string().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get and validate query params
    const query = getQuery(event)
    const params = querySchema.parse(query)

    // Build where clause for filtering
    const where: any = {}
    
    if (params.role) {
      where.role = params.role
    }
    
    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } }
      ]
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isValidEmail: true,
          createdAt: true,
          _count: {
            select: {
              payments: true,
              reviews: true
            }
          }
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ])

    // Get additional stats
    const [totalAdmins, totalCustomers, totalVerified] = await Promise.all([
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { isValidEmail: 1 } })
    ])

    // Transform users for response
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name || 'N/A',
      role: user.role || 'CUSTOMER',
      isEmailVerified: user.isValidEmail === 1,
      totalOrders: user._count.payments,
      totalReviews: user._count.reviews,
      createdAt: user.createdAt
    }))

    // Return users with pagination and stats
    return {
      success: true,
      data: {
        users: transformedUsers,
        stats: {
          totalUsers: totalCount,
          totalAdmins,
          totalCustomers,
          totalVerified
        },
        pagination: {
          total: totalCount,
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(totalCount / params.limit)
        }
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
    console.error('Admin get users error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})
