import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'

// Interface for JWT payload
export interface TokenPayload {
  userId: number
  email: string
  role?: string
}

// Interface for decoded token
export interface DecodedToken extends JwtPayload {
  userId: number
  email: string
  role?: string
}

/**
 * Generate Access Token (expires in 1 hour)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_TOKEN_KEY
  if (!secret) {
    throw new Error('JWT_TOKEN_KEY is not defined in environment variables')
  }

  return jwt.sign(payload, secret, {
    expiresIn: '1h',
    algorithm: 'HS256'
  })
}

/**
 * Generate Refresh Token (expires in 7 days)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.REFRESH_TOKEN_KEY
  if (!secret) {
    throw new Error('REFRESH_TOKEN_KEY is not defined in environment variables')
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    algorithm: 'HS256'
  })
}

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): DecodedToken => {
  const secret = process.env.JWT_TOKEN_KEY
  if (!secret) {
    throw new Error('JWT_TOKEN_KEY is not defined in environment variables')
  }

  try {
    return jwt.verify(token, secret) as DecodedToken
  } catch (error) {
    throw new Error('Invalid or expired access token')
  }
}

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): DecodedToken => {
  const secret = process.env.REFRESH_TOKEN_KEY
  if (!secret) {
    throw new Error('REFRESH_TOKEN_KEY is not defined in environment variables')
  }

  try {
    return jwt.verify(token, secret) as DecodedToken
  } catch (error) {
    throw new Error('Invalid or expired refresh token')
  }
}

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}
