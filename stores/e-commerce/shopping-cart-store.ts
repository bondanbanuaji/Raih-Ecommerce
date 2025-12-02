import { defineStore } from 'pinia'

interface CartProduct {
  id: number
  name: string
  slug: string
  color: string
  price: number
  image: string
  quantity: number
  totalProductPrice: number
}

interface CartState {
  shoppingCartData: CartProduct[]
  totalPrice: number
  showCart: boolean
  isLoading: boolean
}

export const useShoppingCartStore = defineStore('shoppingCart', {
  state: (): CartState => ({
    shoppingCartData: [],
    totalPrice: 0,
    showCart: false,
    isLoading: false
  }),

  getters: {
    cartItemsCount: (state) => state.shoppingCartData.length,
    totalQuantity: (state) => 
      state.shoppingCartData.reduce((sum, item) => sum + item.quantity, 0),
    isCartEmpty: (state) => state.shoppingCartData.length === 0,
    formattedTotalPrice: (state) => `$${state.totalPrice.toFixed(2)}`
  },

  actions: {
    // Initialize cart from localStorage
    initCart() {
      if (process.client) {
        const storedCart = localStorage.getItem('cartData')
        if (storedCart) {
          try {
            const cartData = JSON.parse(storedCart)
            this.shoppingCartData = cartData.items || []
            this.calculateTotalPrice()
          } catch (error) {
            console.error('Failed to parse cart data:', error)
            this.clearCart()
          }
        }
      }
    },

    // Add product to cart
    addProductToCart(product: {
      id: number
      name: string
      slug: string
      color: string
      price: string | number
      image: string
    }) {
      // Convert price to number if it's a string
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : product.price

      // Check if product already exists in cart
      const existingProduct = this.shoppingCartData.find(
        item => item.id === product.id
      )

      if (existingProduct) {
        // Product already in cart, increase quantity
        this.addQuantity(product.id)
      } else {
        // Add new product to cart
        const newCartProduct: CartProduct = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          color: product.color,
          price: price,
          image: product.image,
          quantity: 1,
          totalProductPrice: price
        }

        this.shoppingCartData.push(newCartProduct)
        this.calculateTotalPrice()
        this.storeCartDataToLocalStorage()
      }

      // Show cart sidebar
      this.showCart = true
    },

    // Increase quantity of a product
    addQuantity(productId: number) {
      const product = this.shoppingCartData.find(item => item.id === productId)
      
      if (product) {
        product.quantity++
        product.totalProductPrice = product.price * product.quantity
        this.calculateTotalPrice()
        this.storeCartDataToLocalStorage()
      }
    },

    // Decrease quantity of a product
    reduceQuantity(productId: number) {
      const productIndex = this.shoppingCartData.findIndex(
        item => item.id === productId
      )
      
      if (productIndex !== -1) {
        const product = this.shoppingCartData[productIndex]
        
        if (product.quantity > 1) {
          product.quantity--
          product.totalProductPrice = product.price * product.quantity
        } else {
          // Remove product if quantity becomes 0
          this.shoppingCartData.splice(productIndex, 1)
        }
        
        this.calculateTotalPrice()
        this.storeCartDataToLocalStorage()
      }
    },

    // Remove product from cart
    removeProductFromCart(productId: number) {
      const productIndex = this.shoppingCartData.findIndex(
        item => item.id === productId
      )
      
      if (productIndex !== -1) {
        this.shoppingCartData.splice(productIndex, 1)
        this.calculateTotalPrice()
        this.storeCartDataToLocalStorage()
        
        // Hide cart if empty
        if (this.shoppingCartData.length === 0) {
          this.showCart = false
        }
      }
    },

    // Update quantity directly
    updateQuantity(productId: number, quantity: number) {
      if (quantity < 1) {
        this.removeProductFromCart(productId)
        return
      }

      const product = this.shoppingCartData.find(item => item.id === productId)
      
      if (product) {
        product.quantity = quantity
        product.totalProductPrice = product.price * product.quantity
        this.calculateTotalPrice()
        this.storeCartDataToLocalStorage()
      }
    },

    // Calculate total price
    calculateTotalPrice() {
      this.totalPrice = this.shoppingCartData.reduce(
        (sum, item) => sum + item.totalProductPrice,
        0
      )
    },

    // Store cart data to localStorage
    storeCartDataToLocalStorage() {
      if (process.client) {
        const cartData = {
          items: this.shoppingCartData,
          totalPrice: this.totalPrice
        }
        localStorage.setItem('cartData', JSON.stringify(cartData))
      }
    },

    // Clear entire cart
    clearCart() {
      this.shoppingCartData = []
      this.totalPrice = 0
      this.showCart = false
      
      if (process.client) {
        localStorage.removeItem('cartData')
      }
    },

    // Toggle cart visibility
    toggleCart() {
      this.showCart = !this.showCart
    },

    // Open cart
    openCart() {
      this.showCart = true
    },

    // Close cart
    closeCart() {
      this.showCart = false
    },

    // Get cart data for checkout
    getCheckoutData() {
      return {
        productData: this.shoppingCartData.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          totalProductPrice: item.totalProductPrice
        })),
        totalPrice: this.totalPrice
      }
    },

    // Check if product is in cart
    isProductInCart(productId: number): boolean {
      return this.shoppingCartData.some(item => item.id === productId)
    },

    // Get product quantity in cart
    getProductQuantity(productId: number): number {
      const product = this.shoppingCartData.find(item => item.id === productId)
      return product ? product.quantity : 0
    }
  }
})
