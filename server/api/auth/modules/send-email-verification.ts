import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  name: string
  otpCode: string
}

export const sendVerificationEmail = async ({ to, name, otpCode }: EmailOptions): Promise<boolean> => {
  try {
    const config = useRuntimeConfig()

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.public.mailHost || process.env.MAIL_HOST,
      port: parseInt(config.public.mailPort || process.env.MAIL_PORT || '2525'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: '"Raih E-Commerce" <noreply@raih.com>',
      to: to,
      subject: 'Verify Your Email - Raih E-Commerce',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Email Verification</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .container {
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #3b82f6;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                color: #3b82f6;
              }
              .content {
                margin-bottom: 30px;
              }
              .greeting {
                font-size: 18px;
                margin-bottom: 15px;
              }
              .otp-container {
                background-color: #f0f9ff;
                border: 2px solid #3b82f6;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 25px 0;
              }
              .otp-code {
                font-size: 32px;
                font-weight: bold;
                color: #3b82f6;
                letter-spacing: 5px;
                margin: 10px 0;
              }
              .otp-label {
                font-size: 14px;
                color: #666;
              }
              .instructions {
                background-color: #fafafa;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e5e5e5;
                color: #666;
                font-size: 12px;
              }
              .warning {
                color: #ef4444;
                font-size: 14px;
                margin-top: 20px;
                padding: 10px;
                background-color: #fef2f2;
                border-radius: 5px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #3b82f6;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 15px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">RAIH E-COMMERCE</div>
                <p style="margin: 5px 0; color: #666;">Your trusted online shopping destination</p>
              </div>
              
              <div class="content">
                <div class="greeting">
                  Hello ${name || 'Valued Customer'},
                </div>
                
                <p>Thank you for registering with Raih E-Commerce! To complete your registration and verify your email address, please use the verification code below:</p>
                
                <div class="otp-container">
                  <div class="otp-label">Your Verification Code</div>
                  <div class="otp-code">${otpCode}</div>
                  <div class="otp-label">Valid for 10 minutes</div>
                </div>
                
                <div class="instructions">
                  <strong>How to verify your email:</strong>
                  <ol style="margin: 10px 0; padding-left: 20px;">
                    <li>Return to the Raih E-Commerce website</li>
                    <li>Navigate to the email verification page</li>
                    <li>Enter the 6-digit code shown above</li>
                    <li>Click "Verify" to complete your registration</li>
                  </ol>
                </div>
                
                <p>Once verified, you'll be able to:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Browse and purchase products</li>
                  <li>Track your orders</li>
                  <li>Leave product reviews</li>
                  <li>Access exclusive deals and offers</li>
                </ul>
                
                <div class="warning">
                  <strong>⚠ Security Notice:</strong> If you didn't create an account with Raih E-Commerce, please ignore this email. This verification code will expire in 10 minutes and cannot be used after that.
                </div>
              </div>
              
              <div class="footer">
                <p>© 2024 Raih E-Commerce. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>Need help? Contact our support team at support@raih.com</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Hello ${name || 'Valued Customer'},
        
        Thank you for registering with Raih E-Commerce!
        
        Your verification code is: ${otpCode}
        
        This code is valid for 10 minutes.
        
        If you didn't create an account, please ignore this email.
        
        Best regards,
        Raih E-Commerce Team
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)
    console.log('Verification email sent successfully to:', to)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}
