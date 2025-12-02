import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Failed to hash password')
  }
}

// Compare password with hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hash)
    return isMatch
  } catch (error) {
    console.error('Error comparing password:', error)
    throw new Error('Failed to compare password')
  }
}
