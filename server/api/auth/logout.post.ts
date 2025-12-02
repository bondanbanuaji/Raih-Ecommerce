export default defineEventHandler(async (event) => {
  // Clear authentication cookies
  deleteCookie(event, 'auth-token')
  deleteCookie(event, 'refresh-token')

  return {
    success: true,
    message: 'Logged out successfully'
  }
})
