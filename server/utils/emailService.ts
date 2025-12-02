import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// Create reusable transporter object using SMTP transport
let transporter: Transporter | null = null

/**
 * Get or create email transporter
 */
export const getEmailTransporter = (): Transporter => {
  if (!transporter) {
    const host = process.env.MAIL_HOST
    const port = parseInt(process.env.MAIL_PORT || '587')
    const user = process.env.MAIL_TRAP_USER
    const pass = process.env.MAIL_TRAP_PASSWORD

    if (!host || !user || !pass) {
      throw new Error('Email configuration is incomplete. Please check environment variables.')
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass
      }
    })
  }

  return transporter
}

/**
 * Generate random 6-digit OTP code
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send verification email with OTP
 */
export const sendVerificationEmail = async (
  to: string, 
  name: string, 
  otpCode: string
): Promise<void> => {
  const transporter = getEmailTransporter()

  const mailOptions = {
    from: '"Raih E-Commerce" <noreply@raih.com>',
    to,
    subject: 'Verify Your Email - Raih E-Commerce',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #4CAF50;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #4CAF50;
            }
            .content {
              padding: 30px 0;
            }
            .otp-box {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 10px;
              padding: 20px;
              text-align: center;
              border-radius: 10px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              color: #856404;
              padding: 10px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">RAIH E-COMMERCE</div>
            </div>
            
            <div class="content">
              <h2>Hello ${name || 'User'},</h2>
              <p>Thank you for registering with Raih E-Commerce! To complete your registration and verify your email address, please use the verification code below:</p>
              
              <div class="otp-box">
                ${otpCode}
              </div>
              
              <p><strong>Instructions:</strong></p>
              <ol>
                <li>Copy the 6-digit code above</li>
                <li>Go back to the verification page</li>
                <li>Enter the code in the verification field</li>
                <li>Click "Verify" to complete your registration</li>
              </ol>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This code is valid for only 10 minutes. If you didn't request this verification, please ignore this email.
              </div>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Raih E-Commerce. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Verification email sent to ${to}`)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (
  to: string,
  name: string,
  orderId: string,
  orderDetails: any
): Promise<void> => {
  const transporter = getEmailTransporter()

  const mailOptions = {
    from: '"Raih E-Commerce" <noreply@raih.com>',
    to,
    subject: `Order Confirmation #${orderId} - Raih E-Commerce`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border: 1px solid #ddd;
            }
            .order-details {
              background-color: white;
              padding: 15px;
              margin: 15px 0;
              border-radius: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
            }
            .total {
              font-size: 18px;
              font-weight: bold;
              color: #4CAF50;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${name}!</h2>
            <p>Your order has been successfully placed and is being processed.</p>
            
            <div class="order-details">
              <h3>Order ID: #${orderId}</h3>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderDetails.products?.map((product: any) => `
                    <tr>
                      <td>${product.name}</td>
                      <td>${product.quantity}</td>
                      <td>$${product.price}</td>
                      <td>$${product.totalProductPrice}</td>
                    </tr>
                  `).join('') || ''}
                </tbody>
              </table>
              
              <hr>
              <p class="total">Total Amount: $${orderDetails.totalPrice}</p>
            </div>
            
            <p>We'll send you another email when your order ships.</p>
            <p>If you have any questions, please contact our customer support.</p>
          </div>
        </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Order confirmation email sent to ${to}`)
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw new Error('Failed to send order confirmation email')
  }
}

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const transporter = getEmailTransporter()
  const resetUrl = `${process.env.NUXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`

  const mailOptions = {
    from: '"Raih E-Commerce" <noreply@raih.com>',
    to,
    subject: 'Password Reset Request - Raih E-Commerce',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffc107;
              color: #856404;
              padding: 10px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <h2>Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          
          <div class="warning">
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
        </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Password reset email sent to ${to}`)
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}
