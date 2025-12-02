import { refreshTokenSchema } from '~/server/utils/validationSchemas'
import { verifyRefreshToken, generateAccessToken } from '~/server/utils/jwtToken'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input with Zod schema
    const validatedData = refreshTokenSchema.parse(body)

    // Verify refresh token
    let decodedToken
    try {
      decodedToken = verifyRefreshToken(validatedData.refreshToken)
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired refresh token'
      })
    }

    // Find user to ensure they still exist and are valid
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isValidEmail: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    if (user.isValidEmail !== 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Email not verified'
      })
    }

    // Generate new access token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'CUSTOMER'
    }

    const newAccessToken = generateAccessToken(tokenPayload)

    // Return new access token
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
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
    console.error('Refresh token error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Token refresh failed. Please try again.'
    })
  }
})
