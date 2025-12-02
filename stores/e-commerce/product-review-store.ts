import { defineStore } from 'pinia'
import { useAuthStore } from '../auth/auth-store'

interface Review {
  id: number
  rating: number
  comment: string
  user: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface ReviewState {
  reviews: Review[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  isLoading: boolean
  error: string | null
}

export const useProductReviewStore = defineStore('productReview', {
  state: (): ReviewState => ({
    reviews: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    isLoading: false,
    error: null
  }),

  getters: {
    hasReviews: (state) => state.reviews.length > 0,
    averageRating: (state) => {
      if (state.reviews.length === 0) return 0
      const sum = state.reviews.reduce((acc, review) => acc + review.rating, 0)
      return (sum / state.reviews.length).toFixed(1)
    },
    ratingDistribution: (state) => {
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      state.reviews.forEach(review => {
        distribution[review.rating as keyof typeof distribution]++
      })
      return distribution
    }
  },

  actions: {
    // Fetch reviews for a product
    async fetchProductReviews(
      productId: number, 
      page: number = 1, 
      limit: number = 10,
      sort: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest'
    ) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/e-commerce/get-product-reviews', {
          params: {
            productId,
            page,
            limit,
            sort
          }
        })

        this.reviews = data.data.reviews
        this.pagination = data.data.pagination
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch reviews'
        console.error('Fetch reviews error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Create a new review
    async createReview(productId: number, rating: number, comment: string) {
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) {
        this.error = 'Please login to write a review'
        return { success: false, error: this.error }
      }

      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/e-commerce/create-review', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          },
          body: {
            productId,
            starNumber: rating,
            comment
          }
        })

        // Add new review to the beginning of the list
        this.reviews.unshift(data.data)
        this.pagination.total++

        return { success: true, review: data.data }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to submit review'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Load more reviews (pagination)
    async loadMoreReviews(productId: number) {
      if (this.pagination.page >= this.pagination.totalPages) {
        return
      }

      const nextPage = this.pagination.page + 1
      this.isLoading = true

      try {
        const { data } = await $fetch('/api/e-commerce/get-product-reviews', {
          params: {
            productId,
            page: nextPage,
            limit: this.pagination.limit
          }
        })

        // Append new reviews to existing ones
        this.reviews.push(...data.data.reviews)
        this.pagination = data.data.pagination
      } catch (error: any) {
        console.error('Load more reviews error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Clear reviews
    clearReviews() {
      this.reviews = []
      this.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
      this.error = null
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
