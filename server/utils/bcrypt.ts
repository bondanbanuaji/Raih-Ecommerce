import bcrypt from 'bcrypt'

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @param saltRounds - Number of salt rounds (default: 10)
 * @returns Hashed password
 */
export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    console.error('Error comparing passwords:', error)
    throw new Error('Failed to compare passwords')
  }
}

/**
 * Generate salt for bcrypt
 * @param rounds - Number of rounds (default: 10)
 * @returns Generated salt
 */
export const generateSalt = async (rounds: number = 10): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(rounds)
    return salt
  } catch (error) {
    console.error('Error generating salt:', error)
    throw new Error('Failed to generate salt')
  }
}
