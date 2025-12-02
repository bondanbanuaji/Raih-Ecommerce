import { withAdmin } from '~/server/utils/auth.middleware'
import { updateProductSchema } from '~/server/utils/validationSchemas'
import { generateUniqueSlug } from '~/server/utils/slugify'
import prisma from '~/server/utils/prisma'
import { z } from 'zod'

// Extended schema with product ID and images
const updateProductWithIdSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255).optional(),
  color: z.string().min(1).max(50).optional(),
  price: z.number().positive().multipleOf(0.01).optional(),
  categoryId: z.number().int().positive().optional(),
  images: z.array(z.string().url()).optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Get request body
    const body = await readBody(event)

    // Validate input
    const validatedData = updateProductWithIdSchema.parse(body)

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: validatedData.id }
    })

    if (!existingProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // If categoryId is provided, check if category exists
    if (validatedData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId }
      })

      if (!category) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid category ID'
        })
      }
    }

    // Generate new slug if name changed
    let slug = existingProduct.slug
    if (validatedData.name && validatedData.name !== existingProduct.name) {
      slug = await generateUniqueSlug(
        validatedData.name,
        async (checkSlug) => {
          const existing = await prisma.product.findFirst({
            where: {
              slug: checkSlug,
              NOT: { id: validatedData.id }
            }
          })
          return !!existing
        }
      )
    }

    // Update product with transaction
    const product = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: any = {}
      if (validatedData.name !== undefined) updateData.name = validatedData.name
      if (validatedData.color !== undefined) updateData.color = validatedData.color
      if (validatedData.price !== undefined) updateData.price = validatedData.price
      if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId
      if (slug !== existingProduct.slug) updateData.slug = slug

      // Update the product
      const updatedProduct = await tx.product.update({
        where: { id: validatedData.id },
        data: updateData
      })

      // Update images if provided
      if (validatedData.images !== undefined) {
        // Delete existing images
        await tx.image.deleteMany({
          where: { productId: validatedData.id }
        })

        // Create new images
        if (validatedData.images.length > 0) {
          await tx.image.createMany({
            data: validatedData.images.map(url => ({
              url,
              productId: validatedData.id
            }))
          })
        }
      }

      // Get the product with all relations
      return await tx.product.findUnique({
        where: { id: validatedData.id },
        include: {
          category: true,
          images: true
        }
      })
    })

    if (!product) {
      throw new Error('Failed to update product')
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
      updatedAt: product.updatedAt
    }

    // Return success response
    return {
      success: true,
      message: 'Product updated successfully',
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
    console.error('Update product error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product'
    })
  }
})
