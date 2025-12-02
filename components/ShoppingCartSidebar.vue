<template>
  <!-- Cart Overlay -->
  <Transition name="fade">
    <div
      v-if="cartStore.showCart"
      @click="cartStore.closeCart"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>
  </Transition>

  <!-- Cart Sidebar -->
  <Transition name="slide">
    <div
      v-if="cartStore.showCart"
      class="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Shopping Cart</h2>
          <button
            @click="cartStore.closeCart"
            class="p-1 hover:bg-gray-100 rounded"
          >
            <Icon name="ion:close" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartStore.isCartEmpty" class="text-center py-8">
          <Icon name="ion:cart-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500">Your cart is empty</p>
          <NuxtLink
            to="/"
            @click="cartStore.closeCart"
            class="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Start Shopping
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cartStore.shoppingCartData"
            :key="item.id"
            class="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
          >
            <!-- Product Image -->
            <NuxtImg
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 object-cover rounded"
            />

            <!-- Product Details -->
            <div class="flex-1">
              <h3 class="font-semibold text-sm">{{ item.name }}</h3>
              <p class="text-xs text-gray-500">{{ item.color }}</p>
              <p class="text-sm font-semibold text-indigo-600">${{ item.price }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center space-x-2">
              <button
                @click="cartStore.reduceQuantity(item.id)"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Icon name="ion:remove" class="h-4 w-4" />
              </button>
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <button
                @click="cartStore.addQuantity(item.id)"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
              >
                <Icon name="ion:add" class="h-4 w-4" />
              </button>
            </div>

            <!-- Remove Button -->
            <button
              @click="cartStore.removeProductFromCart(item.id)"
              class="text-red-500 hover:text-red-700"
            >
              <Icon name="ion:trash-outline" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Summary -->
      <div v-if="!cartStore.isCartEmpty" class="border-t p-4">
        <div class="space-y-2 mb-4">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="font-semibold">{{ cartStore.formattedTotalPrice }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div class="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{{ cartStore.formattedTotalPrice }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <NuxtLink
            to="/checkout"
            @click="cartStore.closeCart"
            class="block w-full px-4 py-2 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700"
          >
            Proceed to Checkout
          </NuxtLink>
          <button
            @click="cartStore.closeCart"
            class="block w-full px-4 py-2 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useShoppingCartStore } from '~/stores/e-commerce/shopping-cart-store'

const cartStore = useShoppingCartStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
