<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center">
      <!-- Success Icon -->
      <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
        <Icon name="ion:checkmark" class="h-10 w-10 text-green-600" />
      </div>
      
      <!-- Success Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
      <p class="text-lg text-gray-600 mb-8">
        Thank you for your purchase. We've sent a confirmation email with your order details.
      </p>

      <!-- Order Details -->
      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
        <div class="space-y-3 text-left max-w-md mx-auto">
          <div class="flex items-start">
            <Icon name="ion:mail-outline" class="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
            <div>
              <p class="font-medium text-gray-900">Check your email</p>
              <p class="text-sm text-gray-600">We've sent order confirmation to your email address</p>
            </div>
          </div>
          <div class="flex items-start">
            <Icon name="ion:cube-outline" class="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
            <div>
              <p class="font-medium text-gray-900">Processing your order</p>
              <p class="text-sm text-gray-600">We're preparing your items for shipment</p>
            </div>
          </div>
          <div class="flex items-start">
            <Icon name="ion:car-outline" class="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
            <div>
              <p class="font-medium text-gray-900">Delivery</p>
              <p class="text-sm text-gray-600">You'll receive tracking information once shipped</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          to="/account/orders"
          class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          View My Orders
        </NuxtLink>
        <NuxtLink
          to="/"
          class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          Continue Shopping
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCheckoutStore } from '~/stores/checkout/checkout-store'

// SEO Meta
useHead({
  title: 'Order Success - RAIH',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})

// Store
const checkoutStore = useCheckoutStore()

// Reset checkout state on mount
onMounted(() => {
  checkoutStore.resetCheckout()
})
</script>
