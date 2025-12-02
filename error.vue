<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">
        {{ error?.statusCode || 500 }}
      </h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">
        {{ errorMessage }}
      </h2>
      <p class="text-gray-600 mb-8">
        {{ errorDescription }}
      </p>
      
      <div class="space-x-4">
        <button
          @click="handleError"
          class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  error: Object
})

// Computed
const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page Not Found'
    case 403:
      return 'Access Denied'
    case 401:
      return 'Unauthorized'
    case 500:
      return 'Internal Server Error'
    default:
      return 'Oops! Something went wrong'
  }
})

const errorDescription = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'The page you are looking for does not exist.'
    case 403:
      return 'You do not have permission to access this resource.'
    case 401:
      return 'Please login to access this page.'
    case 500:
      return 'We are experiencing technical difficulties. Please try again later.'
    default:
      return props.error?.statusMessage || 'An unexpected error occurred.'
  }
})

// Methods
const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
