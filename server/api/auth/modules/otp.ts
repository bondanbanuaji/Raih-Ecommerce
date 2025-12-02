// Generate 6-digit OTP code
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp.toString()
}

// Validate OTP format (6 digits)
export const validateOTPFormat = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/
  return otpRegex.test(otp)
}
