import { z } from 'zod'
import { generateOTP, sendVerificationEmail } from '~/server/utils/emailService'
import prisma from '~/server/utils/prisma'

// Schema for resend OTP request
const resendOtpSchema = z.object({
  email: z.string().email('Invalid email format')
})

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input
    const validatedData = resendOtpSchema.parse(body)

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

    // Generate new OTP code
    const newOtpCode = generateOTP()

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: newOtpCode
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(
        user.email,
        user.name || 'User',
        newOtpCode
      )
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send verification email. Please try again later.'
      })
    }

    // Return success response
    return {
      success: true,
      message: 'Verification code sent successfully. Please check your email.',
      data: {
        email: user.email
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
    console.error('Resend OTP error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to resend verification code. Please try again.'
    })
  }
})
