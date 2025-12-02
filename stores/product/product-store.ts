import { defineStore } from 'pinia'

interface Product {
  id: number
  name: string
  slug: string
  color: string
  price: string
  category: {
    id: number
    name: string
  }
  image: string
  rating: string
  reviewCount: number
}

interface ProductDetail extends Product {
  images: Array<{ id: number; url: string }>
  rating: {
    average: string
    totalReviews: number
    totalStars: number
    distribution: Array<{
      star: number
      count: number
      percentage: number
    }>
  }
  createdAt: string
  updatedAt: string
}

interface ProductFilters {
  search: string
  categories: number[]
  colors: string[]
  prices: [number, number] | null
  starRating: number | null
  page: number
  limit: number
}

interface ProductState {
  products: Product[]
  currentProduct: ProductDetail | null
  relatedProducts: Product[]
  filters: ProductFilters
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  isLoading: boolean
  error: string | null
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    currentProduct: null,
    relatedProducts: [],
    filters: {
      search: '',
      categories: [],
      colors: [],
      prices: null,
      starRating: null,
      page: 1,
      limit: 10
    },
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
    hasProducts: (state) => state.products.length > 0,
    hasMorePages: (state) => state.pagination.page < state.pagination.totalPages,
    activeFiltersCount: (state) => {
      let count = 0
      if (state.filters.search) count++
      if (state.filters.categories.length > 0) count++
      if (state.filters.colors.length > 0) count++
      if (state.filters.prices) count++
      if (state.filters.starRating) count++
      return count
    },
    priceRange: (state) => {
      if (state.products.length === 0) return [0, 1000]
      const prices = state.products.map(p => parseFloat(p.price))
      return [Math.min(...prices), Math.max(...prices)]
    }
  },

  actions: {
    // Fetch products with filters
    async fetchProducts(resetPage: boolean = false) {
      this.isLoading = true
      this.error = null

      if (resetPage) {
        this.filters.page = 1
      }

      try {
        const params: any = {
          page: this.filters.page,
          limit: this.filters.limit
        }

        // Add active filters to params
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.categories.length > 0) {
          params.categories = this.filters.categories.join(',')
        }
        if (this.filters.colors.length > 0) {
          params.colors = this.filters.colors.join(',')
        }
        if (this.filters.prices) {
          params.prices = this.filters.prices.join(',')
        }
        if (this.filters.starRating) {
          params.starRating = this.filters.starRating
        }

        const { data } = await $fetch('/api/e-commerce/get-products', {
          params
        })

        this.products = data.data.products
        this.pagination = data.data.pagination
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch products'
        console.error('Fetch products error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Fetch single product by ID or slug
    async fetchProductDetail(idOrSlug: number | string) {
      this.isLoading = true
      this.error = null

      try {
        const params = typeof idOrSlug === 'number' 
          ? { id: idOrSlug }
          : { slug: idOrSlug }

        const { data } = await $fetch('/api/e-commerce/single-product', {
          params
        })

        this.currentProduct = data.data
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch product'
        console.error('Fetch product detail error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Fetch related products
    async fetchRelatedProducts(productId: number, limit: number = 6) {
      try {
        const { data } = await $fetch('/api/e-commerce/get-same-category-products', {
          params: {
            productId,
            limit
          }
        })

        this.relatedProducts = data.data.products
      } catch (error: any) {
        console.error('Fetch related products error:', error)
        this.relatedProducts = []
      }
    },

    // Set search filter
    setSearchFilter(search: string) {
      this.filters.search = search
      this.fetchProducts(true)
    },

    // Toggle category filter
    toggleCategoryFilter(categoryId: number) {
      const index = this.filters.categories.indexOf(categoryId)
      if (index > -1) {
        this.filters.categories.splice(index, 1)
      } else {
        this.filters.categories.push(categoryId)
      }
      this.fetchProducts(true)
    },

    // Toggle color filter
    toggleColorFilter(color: string) {
      const index = this.filters.colors.indexOf(color)
      if (index > -1) {
        this.filters.colors.splice(index, 1)
      } else {
        this.filters.colors.push(color)
      }
      this.fetchProducts(true)
    },

    // Set price range filter
    setPriceFilter(min: number, max: number) {
      this.filters.prices = [min, max]
      this.fetchProducts(true)
    },

    // Set star rating filter
    setRatingFilter(rating: number | null) {
      this.filters.starRating = rating
      this.fetchProducts(true)
    },

    // Clear all filters
    clearFilters() {
      this.filters = {
        search: '',
        categories: [],
        colors: [],
        prices: null,
        starRating: null,
        page: 1,
        limit: 10
      }
      this.fetchProducts()
    },

    // Change page
    changePage(page: number) {
      this.filters.page = page
      this.fetchProducts()
    },

    // Next page
    nextPage() {
      if (this.hasMorePages) {
        this.changePage(this.filters.page + 1)
      }
    },

    // Previous page
    previousPage() {
      if (this.filters.page > 1) {
        this.changePage(this.filters.page - 1)
      }
    },

    // Clear current product
    clearCurrentProduct() {
      this.currentProduct = null
      this.relatedProducts = []
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
