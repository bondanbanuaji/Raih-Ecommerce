import { defineStore } from 'pinia'
import { useAuthStore } from '../auth/auth-store'
import { useShoppingCartStore } from '../e-commerce/shopping-cart-store'

interface CheckoutProduct {
  id: number
  name: string
  price: number
  quantity: number
  totalProductPrice: number
}

interface CheckoutState {
  isProcessing: boolean
  paymentIntentId: string | null
  clientSecret: string | null
  error: string | null
  orderComplete: boolean
}

export const useCheckoutStore = defineStore('checkout', {
  state: (): CheckoutState => ({
    isProcessing: false,
    paymentIntentId: null,
    clientSecret: null,
    error: null,
    orderComplete: false
  }),

  getters: {
    canCheckout: () => {
      const authStore = useAuthStore()
      const cartStore = useShoppingCartStore()
      return authStore.isAuthenticated && !cartStore.isCartEmpty
    }
  },

  actions: {
    // Create payment intent
    async createPaymentIntent() {
      const authStore = useAuthStore()
      const cartStore = useShoppingCartStore()

      // Check if user is authenticated
      if (!authStore.isAuthenticated || !authStore.user) {
        this.error = 'Please login to continue with checkout'
        return { success: false, error: this.error }
      }

      // Check if cart has items
      if (cartStore.isCartEmpty) {
        this.error = 'Your cart is empty'
        return { success: false, error: this.error }
      }

      this.isProcessing = true
      this.error = null

      try {
        const checkoutData = cartStore.getCheckoutData()
        
        const { data } = await $fetch('/api/payment/create-payment', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          },
          body: {
            userData: {
              id: authStore.user.id,
              name: authStore.user.name,
              email: authStore.user.email
            },
            productData: checkoutData.productData,
            totalPrice: checkoutData.totalPrice
          }
        })

        this.paymentIntentId = data.data.paymentIntentId
        this.clientSecret = data.data.clientSecret

        return { 
          success: true, 
          clientSecret: data.data.clientSecret,
          amount: data.data.amount
        }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to create payment'
        return { success: false, error: this.error }
      } finally {
        this.isProcessing = false
      }
    },

    // Process payment (would integrate with Xendit in production)
    async processPayment(paymentMethod: any) {
      this.isProcessing = true
      this.error = null

      try {
        // In production, this would call Xendit to confirm payment
        // For now, simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mark order as complete
        this.orderComplete = true

        // Clear shopping cart
        const cartStore = useShoppingCartStore()
        cartStore.clearCart()

        return { success: true }
      } catch (error: any) {
        this.error = 'Payment failed. Please try again.'
        return { success: false, error: this.error }
      } finally {
        this.isProcessing = false
      }
    },

    // Get user's payment history
    async fetchPaymentHistory(page: number = 1, limit: number = 10) {
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) {
        return { success: false, error: 'Not authenticated' }
      }

      try {
        const { data } = await $fetch('/api/payment/get-payments', {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          },
          params: {
            page,
            limit
          }
        })

        return { 
          success: true, 
          payments: data.data.payments,
          pagination: data.data.pagination,
          totalSpent: data.data.totalSpent
        }
      } catch (error: any) {
        return { 
          success: false, 
          error: error.data?.message || 'Failed to fetch payment history' 
        }
      }
    },

    // Reset checkout state
    resetCheckout() {
      this.paymentIntentId = null
      this.clientSecret = null
      this.error = null
      this.orderComplete = false
      this.isProcessing = false
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
