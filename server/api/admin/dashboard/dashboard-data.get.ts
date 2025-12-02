import { withAdmin } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Execute all queries in parallel for performance
    const [
      paymentsByDate,
      totalPayments,
      totalEarnings,
      totalCustomers,
      totalProducts,
      recentPayments,
      topProducts,
      categoryDistribution
    ] = await Promise.all([
      // Get payments grouped by date for chart
      prisma.payment.groupBy({
        by: ['createdAt'],
        _sum: {
          amount: true
        },
        _count: true,
        orderBy: {
          createdAt: 'asc'
        },
        take: 30 // Last 30 days
      }),

      // Count total payments
      prisma.payment.count(),

      // Sum total earnings
      prisma.payment.aggregate({
        _sum: {
          amount: true
        }
      }),

      // Count customers (users with CUSTOMER role)
      prisma.user.count({
        where: {
          role: 'CUSTOMER'
        }
      }),

      // Count total products
      prisma.product.count(),

      // Get recent payments
      prisma.payment.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          product: {
            select: {
              name: true,
              price: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      }),

      // Get top selling products
      prisma.payment.groupBy({
        by: ['productId'],
        _count: {
          productId: true
        },
        _sum: {
          amount: true
        },
        orderBy: {
          _count: {
            productId: 'desc'
          }
        },
        take: 5
      }),

      // Get category distribution
      prisma.product.groupBy({
        by: ['categoryId'],
        _count: true
      })
    ])

    // Get product details for top products
    const topProductIds = topProducts.map(p => p.productId)
    const topProductDetails = await prisma.product.findMany({
      where: {
        id: {
          in: topProductIds
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        category: {
          select: {
            name: true
          }
        }
      }
    })

    // Get category names for distribution
    const categoryIds = categoryDistribution.map(c => c.categoryId)
    const categoryDetails = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    // Format payments by date for chart
    const formattedPaymentsByDate = paymentsByDate.map(payment => ({
      date: payment.createdAt.toISOString().split('T')[0],
      amount: payment._sum.amount?.toString() || '0',
      count: payment._count
    }))

    // Format top products with details
    const formattedTopProducts = topProducts.map(product => {
      const details = topProductDetails.find(p => p.id === product.productId)
      return {
        productId: product.productId,
        name: details?.name || 'Unknown',
        category: details?.category.name || 'Unknown',
        salesCount: product._count.productId,
        revenue: product._sum.amount?.toString() || '0'
      }
    })

    // Format category distribution
    const formattedCategoryDistribution = categoryDistribution.map(cat => {
      const details = categoryDetails.find(c => c.id === cat.categoryId)
      return {
        categoryId: cat.categoryId,
        name: details?.name || 'Unknown',
        productCount: cat._count
      }
    })

    // Format recent payments
    const formattedRecentPayments = recentPayments.map(payment => ({
      id: payment.id,
      amount: payment.amount.toString(),
      customerName: payment.user.name || 'N/A',
      customerEmail: payment.user.email,
      productName: payment.product.name,
      createdAt: payment.createdAt
    }))

    // Return dashboard data
    return {
      success: true,
      data: {
        stats: {
          totalPayments,
          totalEarnings: totalEarnings._sum.amount?.toString() || '0',
          totalCustomers,
          totalProducts,
          averageOrderValue: totalPayments > 0 
            ? ((totalEarnings._sum.amount || 0) / totalPayments).toFixed(2)
            : '0'
        },
        charts: {
          paymentsByDate: formattedPaymentsByDate,
          topProducts: formattedTopProducts,
          categoryDistribution: formattedCategoryDistribution
        },
        recentPayments: formattedRecentPayments,
        lastUpdated: new Date().toISOString()
      }
    }

  } catch (error: any) {
    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Dashboard data error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard data'
    })
  }
})
