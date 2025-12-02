import type { H3Event } from 'h3'
import { verifyAccessToken, extractTokenFromHeader } from './jwtToken'
import type { DecodedToken } from './jwtToken'
import prisma from './prisma'

export interface AuthenticatedEvent extends H3Event {
  context: H3Event['context'] & {
    user?: {
      id: number
      email: string
      name: string | null
      role: string | null
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const withAuth = async (event: H3Event): Promise<void> => {
  try {
    // Get authorization header
    const authHeader = getHeader(event, 'authorization')
    
    // Extract token from header
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No authentication token provided'
      })
    }

    // Verify token
    let decodedToken: DecodedToken
    try {
      decodedToken = verifyAccessToken(token)
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    // Get user from database to ensure they still exist
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
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    if (user.isValidEmail !== 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Email not verified'
      })
    }

    // Attach user to event context
    event.context.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }

  } catch (error: any) {
    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Auth middleware error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication failed'
    })
  }
}

/**
 * Admin authorization middleware - checks if user has admin role
 */
export const withAdmin = async (event: H3Event): Promise<void> => {
  // First authenticate the user
  await withAuth(event)

  // Check if user has admin role
  const user = event.context.user
  
  if (!user || user.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
}

/**
 * Optional authentication middleware - doesn't throw error if no token
 */
export const withOptionalAuth = async (event: H3Event): Promise<void> => {
  try {
    // Get authorization header
    const authHeader = getHeader(event, 'authorization')
    
    // Extract token from header
    const token = extractTokenFromHeader(authHeader)
    
    // If no token, just continue without setting user
    if (!token) {
      return
    }

    // Try to verify token
    let decodedToken: DecodedToken
    try {
      decodedToken = verifyAccessToken(token)
    } catch (error) {
      // Token is invalid, but we don't throw error for optional auth
      return
    }

    // Get user from database
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

    // If user exists and email is verified, attach to context
    if (user && user.isValidEmail === 1) {
      event.context.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }

  } catch (error) {
    // For optional auth, we don't throw errors
    console.error('Optional auth error:', error)
  }
}

/**
 * Get authenticated user from event context
 */
export const getAuthUser = (event: H3Event) => {
  return event.context.user
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (event: H3Event): boolean => {
  return !!event.context.user
}

/**
 * Check if user is admin
 */
export const isAdmin = (event: H3Event): boolean => {
  return event.context.user?.role === 'ADMIN'
}
