import { PrismaClient } from '@prisma/client'
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '~/server/utils/jwtToken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const refreshToken = body.refreshToken || getCookie(event, 'refresh-token')

    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Refresh token not provided'
      })
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)

    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired refresh token'
      })
    }

    // Get updated user data
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isValidEmail: true
      }
    })

    if (!user || user.isValidEmail !== 1) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found or not verified'
      })
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || 'CUSTOMER'
    }

    const newAccessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    // Set new cookies
    setCookie(event, 'auth-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    })

    setCookie(event, 'refresh-token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return {
      success: true,
      message: 'Tokens refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    }
  } catch (error: any) {
    // Re-throw custom errors
    if (error.statusCode) {
      throw error
    }

    console.error('Refresh token error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to refresh tokens'
    })
  } finally {
    await prisma.$disconnect()
  }
})
