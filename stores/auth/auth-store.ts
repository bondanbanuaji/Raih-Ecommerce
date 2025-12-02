import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string | null
  role: string | null
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isCustomer: (state) => state.user?.role === 'CUSTOMER',
    userName: (state) => state.user?.name || state.user?.email || 'User',
    userId: (state) => state.user?.id || null
  },

  actions: {
    // Initialize auth from localStorage
    async initAuth() {
      if (process.client) {
        const storedToken = localStorage.getItem('accessToken')
        const storedRefreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedRefreshToken && storedUser) {
          this.accessToken = storedToken
          this.refreshToken = storedRefreshToken
          this.user = JSON.parse(storedUser)
          this.isAuthenticated = true

          // Verify token is still valid by fetching user data
          await this.fetchUserData()
        }
      }
    },

    // Login action
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email,
            password
          }
        })

        if (data) {
          this.setAuthData(
            data.data.user,
            data.data.tokens.accessToken,
            data.data.tokens.refreshToken
          )
          return { success: true }
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Login failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Register action
    async register(email: string, name: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/auth/register', {
          method: 'POST',
          body: {
            email,
            name,
            password
          }
        })

        return { success: true, email: data.data.email }
      } catch (error: any) {
        this.error = error.data?.message || 'Registration failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Verify email with OTP
    async verifyEmail(email: string, otpCode: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/auth/email-verification', {
          method: 'POST',
          body: {
            email,
            otpCode
          }
        })

        if (data) {
          this.setAuthData(
            data.data.user,
            data.data.tokens.accessToken,
            data.data.tokens.refreshToken
          )
          return { success: true }
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Verification failed'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Resend OTP
    async resendOTP(email: string) {
      try {
        await $fetch('/api/auth/resend-otp', {
          method: 'POST',
          body: { email }
        })
        return { success: true }
      } catch (error: any) {
        return { success: false, error: error.data?.message || 'Failed to resend OTP' }
      }
    },

    // Fetch current user data
    async fetchUserData() {
      if (!this.accessToken) return

      try {
        const { data } = await $fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })

        if (data) {
          this.user = data.data
        }
      } catch (error) {
        // Token might be expired, try to refresh
        await this.refreshAccessToken()
      }
    },

    // Refresh access token
    async refreshAccessToken() {
      if (!this.refreshToken) {
        this.logout()
        return
      }

      try {
        const { data } = await $fetch('/api/auth/refresh-token', {
          method: 'POST',
          body: {
            refreshToken: this.refreshToken
          }
        })

        if (data) {
          this.accessToken = data.data.accessToken
          this.user = data.data.user
          
          if (process.client) {
            localStorage.setItem('accessToken', this.accessToken)
          }
        }
      } catch (error) {
        // Refresh token is invalid, logout
        this.logout()
      }
    },

    // Set auth data and save to localStorage
    setAuthData(user: User, accessToken: string, refreshToken: string) {
      this.user = user
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.isAuthenticated = true

      if (process.client) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    // Logout action
    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.error = null

      if (process.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }

      // Redirect to home page
      navigateTo('/')
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
