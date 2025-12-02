<template>
  <div>
    <!-- Reviews List -->
    <div v-if="reviewStore.isLoading" class="text-center py-8">
      <Icon name="ion:reload" class="h-6 w-6 animate-spin mx-auto text-indigo-600" />
      <p class="mt-2 text-gray-600">Loading reviews...</p>
    </div>

    <div v-else-if="reviewStore.hasReviews" class="space-y-4">
      <div
        v-for="review in reviewStore.reviews"
        :key="review.id"
        class="bg-white p-6 rounded-lg shadow"
      >
        <div class="flex items-start justify-between">
          <div>
            <!-- User Info -->
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-gray-600 font-semibold">
                  {{ review.user.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="ml-3">
                <p class="font-semibold text-gray-900">{{ review.user.name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</p>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div class="flex">
            <Icon
              v-for="i in 5"
              :key="i"
              :name="i <= review.rating ? 'ion:star' : 'ion:star-outline'"
              :class="[
                'h-4 w-4',
                i <= review.rating ? 'text-yellow-400' : 'text-gray-300'
              ]"
            />
          </div>
        </div>

        <!-- Comment -->
        <p class="mt-4 text-gray-700 leading-relaxed">
          {{ review.comment }}
        </p>
      </div>

      <!-- Load More -->
      <div
        v-if="reviewStore.pagination.page < reviewStore.pagination.totalPages"
        class="text-center pt-4"
      >
        <button
          @click="loadMore"
          :disabled="reviewStore.isLoading"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Load More Reviews
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8 bg-white rounded-lg">
      <Icon name="ion:chatbubbles-outline" class="h-12 w-12 mx-auto text-gray-400 mb-3" />
      <p class="text-gray-500">No reviews yet</p>
      <p class="text-sm text-gray-400 mt-1">Be the first to review this product!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductReviewStore } from '~/stores/e-commerce/product-review-store'

// Props
const props = defineProps<{
  productId: number
}>()

// Store
const reviewStore = useProductReviewStore()

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadMore = () => {
  reviewStore.loadMoreReviews(props.productId)
}

// Fetch reviews on mount
onMounted(() => {
  reviewStore.fetchProductReviews(props.productId)
})

// Clear reviews on unmount
onUnmounted(() => {
  reviewStore.clearReviews()
})
</script>
