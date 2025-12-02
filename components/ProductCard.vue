<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
    <NuxtLink :to="`/product/${product.slug || product.id}`" class="block">
      <!-- Product Image -->
      <div class="relative aspect-w-1 aspect-h-1">
        <NuxtImg
          :src="product.image"
          :alt="product.name"
          class="w-full h-64 object-cover rounded-t-lg"
          loading="lazy"
        />
        <div v-if="isNew" class="absolute top-2 left-2">
          <span class="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
            NEW
          </span>
        </div>
      </div>

      <!-- Product Details -->
      <div class="p-4">
        <!-- Category -->
        <p class="text-xs text-gray-500 uppercase tracking-wide">
          {{ product.category.name }}
        </p>

        <!-- Product Name -->
        <h3 class="mt-1 text-lg font-semibold text-gray-900 line-clamp-2">
          {{ product.name }}
        </h3>

        <!-- Color -->
        <p class="mt-1 text-sm text-gray-600">
          Color: {{ product.color }}
        </p>

        <!-- Rating -->
        <div class="mt-2 flex items-center">
          <div class="flex items-center">
            <Icon
              v-for="i in 5"
              :key="i"
              :name="i <= Math.round(parseFloat(product.rating)) ? 'ion:star' : 'ion:star-outline'"
              :class="[
                'h-4 w-4',
                i <= Math.round(parseFloat(product.rating)) ? 'text-yellow-400' : 'text-gray-300'
              ]"
            />
          </div>
          <span class="ml-2 text-sm text-gray-600">
            {{ product.rating }} ({{ product.reviewCount }})
          </span>
        </div>

        <!-- Price and Action -->
        <div class="mt-4 flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-gray-900">
              ${{ parseFloat(product.price).toFixed(2) }}
            </span>
          </div>
          <button
            @click.prevent="addToCart"
            :disabled="isInCart"
            class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ isInCart ? 'In Cart' : 'Add to Cart' }}
          </button>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useShoppingCartStore } from '~/stores/e-commerce/shopping-cart-store'

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

// Props
const props = defineProps<{
  product: Product
}>()

// Stores
const cartStore = useShoppingCartStore()

// Computed
const isInCart = computed(() => cartStore.isProductInCart(props.product.id))
const isNew = computed(() => {
  // You could check if product was created within last 7 days
  return false
})

// Methods
const addToCart = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  
  if (!isInCart.value) {
    cartStore.addProductToCart({
      id: props.product.id,
      name: props.product.name,
      slug: props.product.slug,
      color: props.product.color,
      price: props.product.price,
      image: props.product.image
    })
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
