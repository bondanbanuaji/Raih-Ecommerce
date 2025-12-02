<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <NuxtLink to="/auth/signin" class="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </NuxtLink>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <input type="hidden" name="remember" value="true">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Name</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
              :disabled="isLoading"
            >
            <span v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</span>
          </div>
          
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              :disabled="isLoading"
            >
            <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
          </div>
          
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              :disabled="isLoading"
            >
            <span v-if="errors.password" class="text-red-500 text-xs">{{ errors.password }}</span>
          </div>
          
          <div>
            <label for="confirm-password" class="sr-only">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="formData.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm Password"
              :disabled="isLoading"
            >
            <span v-if="errors.confirmPassword" class="text-red-500 text-xs">{{ errors.confirmPassword }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="agree-terms"
              v-model="formData.agreeToTerms"
              name="agree-terms"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              :disabled="isLoading"
            >
            <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
              I agree to the Terms and Conditions
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !formData.agreeToTerms"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Creating Account...' : 'Sign up' }}
          </button>
        </div>

        <div v-if="generalError" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ generalError }}
              </h3>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth-store'

// Page meta
definePageMeta({
  layout: 'auth'
})

// Store
const authStore = useAuthStore()
const router = useRouter()

// Form data
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

// State
const isLoading = ref(false)
const generalError = ref('')
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Form validation
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  generalError.value = ''

  // Name validation
  if (formData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Invalid email format'
    isValid = false
  }

  // Password validation
  if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    errors.password = 'Password must contain uppercase, lowercase and number'
    isValid = false
  }

  // Confirm password validation
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

// Handle signup
const handleSignup = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  generalError.value = ''

  const result = await authStore.register(
    formData.email,
    formData.name,
    formData.password
  )

  isLoading.value = false

  if (result.success) {
    // Redirect to email verification page
    router.push({
      path: '/auth/email-verification',
      query: { email: result.email }
    })
  } else {
    generalError.value = result.error || 'Registration failed'
  }
}
</script>
