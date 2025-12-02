import { signupSchema } from '~/server/utils/validationSchemas'
import { hashPassword } from '~/server/utils/bcrypt'
import { generateOTP, sendVerificationEmail } from '~/server/utils/emailService'
import prisma, { handlePrismaError } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody(event)

    // Validate input with Zod schema
    const validatedData = signupSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already registered'
      })
    }

    // Hash the password
    const hashedPassword = await hashPassword(validatedData.password)

    // Generate OTP code
    const otpCode = generateOTP()

    // Create new user with unverified email
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        otpCode: otpCode,
        isValidEmail: 0, // Email not verified yet
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(
        newUser.email,
        newUser.name || 'User',
        otpCode
      )
    } catch (emailError) {
      // If email fails, delete the user and throw error
      await prisma.user.delete({
        where: { id: newUser.id }
      })
      
      console.error('Email sending failed:', emailError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send verification email. Please try again.'
      })
    }

    // Return success response
    return {
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        email: newUser.email,
        name: newUser.name
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

    // Handle Prisma errors
    if (error.code && error.code.startsWith('P')) {
      const prismaError = handlePrismaError(error)
      throw createError({
        statusCode: prismaError.statusCode,
        statusMessage: prismaError.message
      })
    }

    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Registration error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed. Please try again.'
    })
  }
})
