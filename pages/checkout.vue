<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

    <!-- Check if cart is empty -->
    <div v-if="cartStore.isCartEmpty" class="text-center py-12">
      <Icon name="ion:cart-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-600 mb-6">Add some products before checkout</p>
      <NuxtLink to="/" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Continue Shopping
      </NuxtLink>
    </div>

    <!-- Checkout Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Billing/Shipping Form -->
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>

          <form @submit.prevent="handleCheckout">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Full Name -->
              <div class="md:col-span-2">
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  v-model="billingInfo.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="billingInfo.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  v-model="billingInfo.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- Country -->
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  v-model="billingInfo.country"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="ID">Indonesia</option>
                </select>
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  id="address"
                  v-model="billingInfo.address"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- City -->
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  v-model="billingInfo.city"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- State -->
              <div>
                <label for="state" class="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  id="state"
                  v-model="billingInfo.state"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>

              <!-- Zip -->
              <div>
                <label for="zip" class="block text-sm font-medium text-gray-700 mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  id="zip"
                  v-model="billingInfo.zip"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                >
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">
                  You will be redirected to secure payment page powered by Xendit
                </p>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="checkoutStore.error" class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {{ checkoutStore.error }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="checkoutStore.isProcessing"
              class="mt-6 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {{ checkoutStore.isProcessing ? 'Processing...' : 'Proceed to Payment' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Order Summary -->
      <div>
        <div class="bg-white p-6 rounded-lg shadow sticky top-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

          <!-- Cart Items -->
          <div class="space-y-4 mb-6">
            <div
              v-for="item in cartStore.shoppingCartData"
              :key="item.id"
              class="flex items-center space-x-3"
            >
              <NuxtImg
                :src="item.image"
                :alt="item.name"
                class="w-16 h-16 object-cover rounded"
              />
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-gray-900 line-clamp-1">{{ item.name }}</h4>
                <p class="text-xs text-gray-600">Qty: {{ item.quantity }}</p>
              </div>
              <p class="text-sm font-semibold">${{ item.totalProductPrice.toFixed(2) }}</p>
            </div>
          </div>

          <!-- Summary -->
          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-semibold">{{ cartStore.formattedTotalPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Shipping</span>
              <span class="text-gray-600">Free</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax</span>
              <span class="text-gray-600">$0.00</span>
            </div>
            <div class="border-t pt-2">
              <div class="flex justify-between">
                <span class="text-lg font-semibold">Total</span>
                <span class="text-lg font-semibold text-indigo-600">{{ cartStore.formattedTotalPrice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth-store'
import { useShoppingCartStore } from '~/stores/e-commerce/shopping-cart-store'
import { useCheckoutStore } from '~/stores/checkout/checkout-store'

// Page meta
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Checkout - RAIH',
  meta: [
    { name: 'description', content: 'Complete your purchase at RAIH' },
  ]
})

// Stores
const authStore = useAuthStore()
const cartStore = useShoppingCartStore()
const checkoutStore = useCheckoutStore()
const router = useRouter()

// Billing information
const billingInfo = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: '',
  country: 'US',
  address: '',
  city: '',
  state: '',
  zip: ''
})

// Handle checkout
const handleCheckout = async () => {
  checkoutStore.clearError()
  
  // Create payment intent
  const result = await checkoutStore.createPaymentIntent()
  
  if (result.success) {
    // In production, you would initialize Xendit payment here
    // For now, simulate payment success
    await checkoutStore.processPayment({
      billingInfo: billingInfo
    })
    
    if (checkoutStore.orderComplete) {
      router.push('/order-success')
    }
  }
}

// Initialize on mount
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({
      path: '/auth/signin',
      query: { redirect: '/checkout' }
    })
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
