import { withAdmin } from '~/server/utils/auth.middleware'
import { upload, getPublicUrl } from '~/server/utils/upload'
import type { IncomingMessage } from 'http'

// Extend the event type to handle files
interface MulterRequest extends IncomingMessage {
  files?: Express.Multer.File[]
  file?: Express.Multer.File
}

export default defineEventHandler(async (event) => {
  try {
    // Check admin authorization
    await withAdmin(event)

    // Return promise to handle async multer middleware
    return new Promise((resolve, reject) => {
      // Use multer to handle multiple file uploads
      upload.array('images', 10)(event.node.req as any, event.node.res as any, (err) => {
        if (err) {
          // Handle multer errors
          if (err.message) {
            reject(createError({
              statusCode: 400,
              statusMessage: err.message
            }))
          } else {
            reject(createError({
              statusCode: 500,
              statusMessage: 'File upload failed'
            }))
          }
          return
        }

        // Get uploaded files
        const req = event.node.req as any
        const files = req.files as Express.Multer.File[]

        if (!files || files.length === 0) {
          reject(createError({
            statusCode: 400,
            statusMessage: 'No files uploaded'
          }))
          return
        }

        // Generate public URLs for uploaded files
        const uploadedImages = files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          url: getPublicUrl(file.filename)
        }))

        // Return success response
        resolve({
          success: true,
          message: `${uploadedImages.length} image(s) uploaded successfully`,
          data: {
            images: uploadedImages
          }
        })
      })
    })

  } catch (error: any) {
    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }

    // Handle unexpected errors
    console.error('Upload images error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload images'
    })
  }
})
