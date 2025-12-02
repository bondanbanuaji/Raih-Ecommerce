import { withAuth, getAuthUser } from '~/server/utils/auth.middleware'
import { createPaymentSchema } from '~/server/utils/validationSchemas'
import { xendit, formatAmountForXendit } from '~/server/utils/xendit'
import { sendOrderConfirmationEmail } from '~/server/utils/emailService'
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user
    await withAuth(event)
    const authUser = getAuthUser(event)
    
    if (!authUser) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    // Get request body
    const body = await readBody(event)
    
    // Validate input
    const validatedData = createPaymentSchema.parse(body)

    // Verify total price calculation
    const calculatedTotal = validatedData.productData.reduce(
      (sum, product) => sum + product.totalProductPrice,
      0
    )

    if (Math.abs(calculatedTotal - validatedData.totalPrice) > 0.01) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Total price mismatch. Please refresh and try again.'
      })
    }

    // Validate that totalPrice is greater than 0
    if (validatedData.totalPrice <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid total amount'
      })
    }

    // Create or get Xendit customer
    const customer = await xendit.createCustomer(
      validatedData.userData.email,
      validatedData.userData.name
    )

    // Create payment intent with Xendit
    const paymentIntent = await xendit.createPaymentIntent(
      validatedData.totalPrice,
      'USD',
      customer.id
    )

    // Store payment records in database (one for each product)
    const paymentRecords = await prisma.$transaction(async (tx) => {
      const records = []
      
      for (const product of validatedData.productData) {
        // Verify product exists and get latest price
        const dbProduct = await tx.product.findUnique({
          where: { id: product.id }
        })

        if (!dbProduct) {
          throw new Error(`Product ${product.name} not found`)
        }

        // Create payment record
        const payment = await tx.payment.create({
          data: {
            userId: authUser.id,
            productId: product.id,
            amount: product.totalProductPrice
          }
        })
        
        records.push(payment)
      }
      
      return records
    })

    // Prepare order details for email
    const orderDetails = {
      products: validatedData.productData,
      totalPrice: validatedData.totalPrice
    }

    // Send order confirmation email (async, don't wait)
    sendOrderConfirmationEmail(
      validatedData.userData.email,
      validatedData.userData.name || 'Customer',
      paymentIntent.id,
      orderDetails
    ).catch(err => {
      console.error('Failed to send confirmation email:', err)
    })

    // Return payment intent details for frontend to complete payment
    return {
      success: true,
      message: 'Payment intent created successfully',
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentIds: paymentRecords.map(p => p.id)
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
    console.error('Create payment error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create payment. Please try again.'
    })
  }
})
