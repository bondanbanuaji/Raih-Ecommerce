<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">All Products</h1>
      <p class="mt-2 text-gray-600">Discover our amazing collection</p>
    </div>

    <div class="flex gap-8">
      <!-- Filters Sidebar -->
      <aside class="w-64 flex-shrink-0">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Filters</h2>
            <button
              v-if="productStore.activeFiltersCount > 0"
              @click="productStore.clearFilters"
              class="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Clear all
            </button>
          </div>

          <!-- Categories Filter -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
            <div class="space-y-2">
              <label
                v-for="category in categories"
                :key="category.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :checked="productStore.filters.categories.includes(category.id)"
                  @change="productStore.toggleCategoryFilter(category.id)"
                  class="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                >
                <span class="ml-2 text-sm text-gray-700">
                  {{ category.name }} ({{ category.productCount }})
                </span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <input
                  v-model.number="priceRange.min"
                  type="number"
                  placeholder="Min"
                  class="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
                <span>-</span>
                <input
                  v-model.number="priceRange.max"
                  type="number"
                  placeholder="Max"
                  class="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
              </div>
              <button
                @click="applyPriceFilter"
                class="w-full px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>

          <!-- Colors Filter -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Colors</h3>
            <div class="space-y-2">
              <label
                v-for="color in availableColors"
                :key="color.name"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :checked="productStore.filters.colors.includes(color.name)"
                  @change="productStore.toggleColorFilter(color.name)"
                  class="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                >
                <span class="ml-2 text-sm text-gray-700">
                  {{ color.name }} ({{ color.count }})
                </span>
              </label>
            </div>
          </div>

          <!-- Rating Filter -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Rating</h3>
            <div class="space-y-2">
              <label
                v-for="rating in [5, 4, 3, 2, 1]"
                :key="rating"
                class="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  :checked="productStore.filters.starRating === rating"
                  @change="productStore.setRatingFilter(rating)"
                  class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                >
                <div class="ml-2 flex items-center">
                  <div class="flex">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      :name="i <= rating ? 'ion:star' : 'ion:star-outline'"
                      :class="[
                        'h-4 w-4',
                        i <= rating ? 'text-yellow-400' : 'text-gray-300'
                      ]"
                    />
                  </div>
                  <span class="ml-1 text-sm text-gray-700">& up</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="flex-1">
        <!-- Sort and View Options -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing {{ productStore.products.length }} of {{ productStore.pagination.total }} products
            </p>
            <div class="flex items-center space-x-4">
              <select
                v-model="sortBy"
                @change="handleSort"
                class="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="productStore.isLoading" class="text-center py-8">
          <Icon name="ion:reload" class="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p class="mt-2 text-gray-600">Loading products...</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="productStore.hasProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            v-for="product in productStore.products"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- No Products -->
        <div v-else class="text-center py-8">
          <Icon name="ion:cube-outline" class="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500">No products found</p>
          <button
            @click="productStore.clearFilters"
            class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Clear Filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="productStore.pagination.totalPages > 1" class="mt-8">
          <nav class="flex items-center justify-center space-x-2">
            <button
              @click="productStore.previousPage"
              :disabled="productStore.pagination.page === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span
              v-for="page in visiblePages"
              :key="page"
              @click="page !== '...' && productStore.changePage(page)"
              :class="[
                'px-3 py-1 rounded text-sm cursor-pointer',
                page === productStore.pagination.page
                  ? 'bg-indigo-600 text-white'
                  : page === '...'
                  ? 'cursor-default'
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </span>

            <button
              @click="productStore.nextPage"
              :disabled="!productStore.hasMorePages"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '~/stores/product/product-store'
import { useCategoryStore } from '~/stores/category/category-store'

// SEO Meta
useHead({
  title: 'RAIH - Quality Products Online',
  meta: [
    { name: 'description', content: 'Discover amazing products at RAIH. Shop the latest trends with secure payment and fast delivery.' },
    { property: 'og:title', content: 'RAIH - Quality Products Online' },
    { property: 'og:description', content: 'Discover amazing products at RAIH' },
  ]
})

// Stores
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const priceRange = reactive({
  min: 0,
  max: 1000
})
const sortBy = ref('newest')
const availableColors = ref<Array<{ name: string; count: number }>>([])

// Computed
const categories = computed(() => categoryStore.categories)
const visiblePages = computed(() => {
  const current = productStore.pagination.page
  const total = productStore.pagination.totalPages
  const pages: Array<number | string> = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// Methods
const applyPriceFilter = () => {
  if (priceRange.min >= 0 && priceRange.max > priceRange.min) {
    productStore.setPriceFilter(priceRange.min, priceRange.max)
  }
}

const handleSort = () => {
  // Sorting would be handled server-side in production
  // This is a placeholder for the UI
}

const fetchColors = async () => {
  try {
    const { data } = await $fetch('/api/e-commerce/get-colors')
    availableColors.value = data.data.colors
  } catch (error) {
    console.error('Failed to fetch colors:', error)
  }
}

// Initialize data
onMounted(async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories(),
    fetchColors()
  ])
})
</script>
