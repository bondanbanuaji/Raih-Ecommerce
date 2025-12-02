import { signInSchema } from '~/server/utils/validationSchemas'
import { comparePassword } from '~/server/utils/bcrypt'
import { generateAccessToken, generateRefreshToken } from '~/server/utils/jwtToken'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input with Zod schema
    const validatedData = signInSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    // Check if user exists
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Check if email is verified
    if (user.isValidEmail !== 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Please verify your email before logging in'
      })
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedData.password, user.password)
    
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid email or password'
      })
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'CUSTOMER'
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    // Return success response with tokens and user data
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
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
    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed. Please try again.'
    })
  }
})
