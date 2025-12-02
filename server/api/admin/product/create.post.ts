import { withAdmin } from '~/server/utils/auth.middleware'
import { productSchema } from '~/server/utils/validationSchemas'
import { generateUniqueSlug } from '~/server/utils/slugify'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Extended schema with optional images
const createProductSchema = productSchema.extend({
  images: z.array(z.string().url()).optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get request body
    const body = await readBody(event)

    // Validate input
    const validatedData = createProductSchema.parse(body)

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid category ID'
      })
    }

    // Generate unique slug from product name
    const slug = await generateUniqueSlug(
      validatedData.name,
      async (slug) => {
        const existing = await prisma.product.findFirst({
          where: { slug }
        })
        return !!existing
      }
    )

    // Create product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.product.create({
        data: {
          name: validatedData.name,
          slug,
          color: validatedData.color,
          price: validatedData.price,
          categoryId: validatedData.categoryId
        },
        include: {
          category: true
        }
      })

      // Create images if provided
      if (validatedData.images && validatedData.images.length > 0) {
        await tx.image.createMany({
          data: validatedData.images.map(url => ({
            url,
            productId: newProduct.id
          }))
        })
      }

      // Initialize product star record
      await tx.productStar.create({
        data: {
          productId: newProduct.id,
          receivedStars: 0
        }
      })

      // Get the product with all relations
      return await tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          category: true,
          images: true
        }
      })
    })

    if (!product) {
      throw new Error('Failed to create product')
    }

    // Transform product for response
    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      price: product.price.toString(),
      category: {
        id: product.category.id,
        name: product.category.name
      },
      images: product.images.map(img => ({
        id: img.id,
        url: img.url
      })),
      createdAt: product.createdAt
    }

    // Return success response
    return {
      success: true,
      message: 'Product created successfully',
      data: transformedProduct
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
    console.error('Create product error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product'
    })
  }
})
