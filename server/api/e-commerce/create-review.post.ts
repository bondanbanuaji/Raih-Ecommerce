import { z } from 'zod'
import { withAuth, getAuthUser } from '~/server/utils/auth.middleware'
import prisma from '~/server/utils/prisma'

// Schema for creating review
const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  starNumber: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000)
})

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user
    await withAuth(event)
    const authUser = getAuthUser(event)
    
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    // Get request body
    const body = await readBody(event)
    
    // Validate input
    const validatedData = createReviewSchema.parse(body)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.productReview.findUnique({
      where: {
        userId_productId: {
          userId: authUser.id,
          productId: validatedData.productId
        }
      }
    })

    if (existingReview) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You have already reviewed this product'
      })
    }

    // Start a transaction to create review and update star statistics
    const result = await prisma.$transaction(async (tx) => {
      // Create the review
      const review = await tx.productReview.create({
        data: {
          userId: authUser.id,
          productId: validatedData.productId,
          starNumber: validatedData.starNumber,
          comment: validatedData.comment
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      // Update or create productStar record
      const existingStar = await tx.productStar.findUnique({
        where: { productId: validatedData.productId }
      })

      if (existingStar) {
        // Update existing star record
        await tx.productStar.update({
          where: { productId: validatedData.productId },
          data: {
            receivedStars: existingStar.receivedStars + validatedData.starNumber
          }
        })
      } else {
        // Create new star record
        await tx.productStar.create({
          data: {
            productId: validatedData.productId,
            receivedStars: validatedData.starNumber
          }
        })
      }

      // Update or create productStarPercent record
      const existingStarPercent = await tx.productStarPercent.findUnique({
        where: {
          productId_star: {
            productId: validatedData.productId,
            star: validatedData.starNumber
          }
        }
      })

      if (existingStarPercent) {
        // Increment times for this star rating
        await tx.productStarPercent.update({
          where: {
            productId_star: {
              productId: validatedData.productId,
              star: validatedData.starNumber
            }
          },
          data: {
            times: existingStarPercent.times + 1
          }
        })
      } else {
        // Create new star percent record
        await tx.productStarPercent.create({
          data: {
            productId: validatedData.productId,
            star: validatedData.starNumber,
            times: 1
          }
        })
      }

      return review
    })

    // Transform review for response
    const transformedReview = {
      id: result.id,
      rating: result.starNumber,
      comment: result.comment,
      user: {
        id: result.user.id,
        name: result.user.name || 'Anonymous',
        email: result.user.email.substring(0, 2) + '***@' + result.user.email.split('@')[1]
      },
      createdAt: result.createdAt
    }

    // Return success response
    return {
      success: true,
      message: 'Review submitted successfully',
      data: transformedReview
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
    console.error('Create review error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit review'
    })
  }
})
