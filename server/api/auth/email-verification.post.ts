import { emailVerificationSchema } from '~/server/utils/validationSchemas'
import { generateAccessToken, generateRefreshToken } from '~/server/utils/jwtToken'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input with Zod schema
    const validatedData = emailVerificationSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    // Check if user exists
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Check if email is already verified
    if (user.isValidEmail === 1) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already verified'
      })
    }

    // Verify OTP code
    if (user.otpCode !== validatedData.otpCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid verification code'
      })
    }

    // Update user's email verification status
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isValidEmail: 1,
        otpCode: null // Clear OTP after successful verification
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Generate JWT tokens for auto-login after verification
    const tokenPayload = {
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role || 'CUSTOMER'
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Return success response with tokens for auto-login
    return {
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        },
        tokens: {
          accessToken,
          refreshToken
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
    console.error('Email verification error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Verification failed. Please try again.'
    })
  }
})
