<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="productStore.isLoading" class="text-center py-12">
      <Icon name="ion:reload" class="h-8 w-8 animate-spin mx-auto text-indigo-600" />
      <p class="mt-2 text-gray-600">Loading product details...</p>
    </div>

    <!-- Product Not Found -->
    <div v-else-if="!product" class="text-center py-12">
      <Icon name="ion:alert-circle-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
      <p class="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
      <NuxtLink to="/" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Back to Shop
      </NuxtLink>
    </div>

    <!-- Product Details -->
    <div v-else>
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <NuxtLink to="/" class="hover:text-indigo-600">Home</NuxtLink>
          </li>
          <li>/</li>
          <li>
            <NuxtLink to="/" class="hover:text-indigo-600">{{ product.category.name }}</NuxtLink>
          </li>
          <li>/</li>
          <li class="text-gray-900">{{ product.name }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Images -->
        <div>
          <div class="bg-white rounded-lg overflow-hidden">
            <NuxtImg
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-96 object-cover"
            />
          </div>
          <!-- Image Thumbnails -->
          <div v-if="product.images.length > 1" class="mt-4 grid grid-cols-4 gap-2">
            <button
              v-for="image in product.images"
              :key="image.id"
              @click="selectedImage = image.url"
              :class="[
                'border-2 rounded overflow-hidden',
                selectedImage === image.url ? 'border-indigo-600' : 'border-gray-200'
              ]"
            >
              <NuxtImg
                :src="image.url"
                :alt="product.name"
                class="w-full h-20 object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          
          <!-- Rating -->
          <div class="mt-4 flex items-center">
            <div class="flex items-center">
              <Icon
                v-for="i in 5"
                :key="i"
                :name="i <= Math.round(parseFloat(product.rating.average)) ? 'ion:star' : 'ion:star-outline'"
                :class="[
                  'h-5 w-5',
                  i <= Math.round(parseFloat(product.rating.average)) ? 'text-yellow-400' : 'text-gray-300'
                ]"
              />
            </div>
            <span class="ml-2 text-gray-600">
              {{ product.rating.average }} ({{ product.rating.totalReviews }} reviews)
            </span>
          </div>

          <!-- Price -->
          <div class="mt-6">
            <span class="text-4xl font-bold text-gray-900">
              ${{ parseFloat(product.price).toFixed(2) }}
            </span>
          </div>

          <!-- Product Details -->
          <div class="mt-6 space-y-4">
            <div>
              <span class="text-gray-600">Category:</span>
              <span class="ml-2 font-semibold">{{ product.category.name }}</span>
            </div>
            <div>
              <span class="text-gray-600">Color:</span>
              <span class="ml-2 font-semibold">{{ product.color }}</span>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="mt-8 space-y-4">
            <div class="flex items-center space-x-4">
              <label class="text-gray-600">Quantity:</label>
              <div class="flex items-center space-x-2">
                <button
                  @click="quantity > 1 && quantity--"
                  class="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Icon name="ion:remove" />
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                >
                <button
                  @click="quantity++"
                  class="w-10 h-10 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Icon name="ion:add" />
                </button>
              </div>
            </div>

            <button
              @click="addToCart"
              class="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>

          <!-- Description -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p class="text-gray-600 leading-relaxed">
              Experience the perfect blend of style and functionality with this premium product. 
              Crafted with attention to detail and built to last. This item features high-quality 
              materials and modern design that suits any lifestyle.
            </p>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

        <!-- Rating Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <!-- Average Rating -->
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="text-center">
              <p class="text-4xl font-bold text-gray-900">{{ product.rating.average }}</p>
              <div class="flex justify-center mt-2">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  :name="i <= Math.round(parseFloat(product.rating.average)) ? 'ion:star' : 'ion:star-outline'"
                  :class="[
                    'h-5 w-5',
                    i <= Math.round(parseFloat(product.rating.average)) ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                />
              </div>
              <p class="mt-2 text-gray-600">{{ product.rating.totalReviews }} reviews</p>
            </div>
          </div>

          <!-- Rating Distribution -->
          <div class="bg-white p-6 rounded-lg shadow col-span-2">
            <div class="space-y-2">
              <div
                v-for="dist in product.rating.distribution"
                :key="dist.star"
                class="flex items-center"
              >
                <span class="text-sm text-gray-600 w-12">{{ dist.star }} star</span>
                <div class="flex-1 mx-3">
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      :style="{ width: dist.percentage + '%' }"
                      class="h-full bg-yellow-400"
                    ></div>
                  </div>
                </div>
                <span class="text-sm text-gray-600 w-12 text-right">{{ dist.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Write Review -->
        <WriteReview 
          v-if="authStore.isAuthenticated" 
          :product-id="product.id"
          @review-submitted="onReviewSubmitted"
        />

        <!-- Reviews List -->
        <ProductReviews :product-id="product.id" />
      </div>

      <!-- Related Products -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="relatedProduct in productStore.relatedProducts"
            :key="relatedProduct.id"
            :product="relatedProduct"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/product/product-store'
import { useShoppingCartStore } from '~/stores/e-commerce/shopping-cart-store'
import { useAuthStore } from '~/stores/auth/auth-store'
import { useProductReviewStore } from '~/stores/e-commerce/product-review-store'

// Route
const route = useRoute()
const router = useRouter()

// Stores
const productStore = useProductStore()
const cartStore = useShoppingCartStore()
const authStore = useAuthStore()
const reviewStore = useProductReviewStore()

// State
const quantity = ref(1)
const selectedImage = ref('')

// Computed
const product = computed(() => productStore.currentProduct)
const slug = computed(() => route.params.slug as string)

// SEO Meta
useHead(() => ({
  title: product.value ? `${product.value.name} - RAIH` : 'Product - RAIH',
  meta: [
    { 
      name: 'description', 
      content: product.value ? `Buy ${product.value.name} at RAIH. ${product.value.category.name} - $${product.value.price}` : 'Product details'
    },
    { 
      property: 'og:title', 
      content: product.value ? product.value.name : 'Product'
    },
  ]
}))

// Methods
const addToCart = () => {
  if (!product.value) return

  for (let i = 0; i < quantity.value; i++) {
    cartStore.addProductToCart({
      id: product.value.id,
      name: product.value.name,
      slug: product.value.slug,
      color: product.value.color,
      price: product.value.price,
      image: selectedImage.value || product.value.images[0]?.url || ''
    })
  }
  
  quantity.value = 1
}

const onReviewSubmitted = () => {
  // Refresh product data to get updated rating
  productStore.fetchProductDetail(slug.value)
}

// Fetch product data
onMounted(async () => {
  await productStore.fetchProductDetail(slug.value)
  
  if (product.value) {
    selectedImage.value = product.value.images[0]?.url || ''
    await productStore.fetchRelatedProducts(product.value.id)
  }
})
</script>
