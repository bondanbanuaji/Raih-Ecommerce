<template>
  <div class="bg-white p-6 rounded-lg shadow mb-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
    
    <form @submit.prevent="submitReview">
      <!-- Rating Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div class="flex items-center space-x-1">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="rating = star"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="focus:outline-none"
          >
            <Icon
              :name="(hoverRating || rating) >= star ? 'ion:star' : 'ion:star-outline'"
              :class="[
                'h-8 w-8 transition-colors',
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
              ]"
            />
          </button>
        </div>
      </div>

      <!-- Comment -->
      <div class="mb-4">
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          required
          placeholder="Share your experience with this product..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting || rating === 0"
        class="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useProductReviewStore } from '~/stores/e-commerce/product-review-store'

// Props
const props = defineProps<{
  productId: number
}>()

// Emits
const emit = defineEmits<{
  'review-submitted': []
}>()

// Store
const reviewStore = useProductReviewStore()

// State
const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')
const isSubmitting = ref(false)
const error = ref('')

// Submit review
const submitReview = async () => {
  if (rating.value === 0) {
    error.value = 'Please select a rating'
    return
  }

  if (!comment.value.trim()) {
    error.value = 'Please write a comment'
    return
  }

  isSubmitting.value = true
  error.value = ''

  const result = await reviewStore.createReview(
    props.productId,
    rating.value,
    comment.value
  )

  isSubmitting.value = false

  if (result.success) {
    // Reset form
    rating.value = 0
    comment.value = ''
    emit('review-submitted')
  } else {
    error.value = result.error || 'Failed to submit review'
  }
}
</script>
