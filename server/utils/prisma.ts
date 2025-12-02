import { PrismaClient } from '../../generated/prisma'

// Declare prisma client instance
let prisma: PrismaClient

// Check if we're in production or development
const isDevelopment = process.env.NODE_ENV === 'development'

// In development, use a global variable to prevent multiple instances
// during hot reloading
if (isDevelopment) {
  // @ts-ignore
  if (!global.__prisma) {
    // @ts-ignore
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn']
    })
  }
  // @ts-ignore
  prisma = global.__prisma
} else {
  // In production, create a single instance
  prisma = new PrismaClient({
    log: ['error']
  })
}

// Export the prisma client instance
export default prisma

// Helper function to handle database connection
export const connectDatabase = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

// Helper function to disconnect database
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect()
    console.log('Database disconnected')
  } catch (error) {
    console.error('Error disconnecting database:', error)
  }
}

// Helper to handle Prisma errors
export const handlePrismaError = (error: any) => {
  if (error.code === 'P2002') {
    // Unique constraint violation
    const field = error.meta?.target?.[0] || 'field'
    return {
      statusCode: 400,
      message: `The ${field} already exists`
    }
  }
  
  if (error.code === 'P2003') {
    // Foreign key constraint violation
    return {
      statusCode: 400,
      message: 'Invalid reference to related record'
    }
  }
  
  if (error.code === 'P2025') {
    // Record not found
    return {
      statusCode: 404,
      message: 'Record not found'
    }
  }
  
  // Default error
  return {
    statusCode: 500,
    message: 'Database operation failed'
  }
}
