<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit verification code to
          <span class="font-medium text-gray-900">{{ userEmail }}</span>
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 text-center mb-4">
            Enter verification code
          </label>
          
          <div class="flex justify-center space-x-2">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpRefs[index] = el"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
              :disabled="isLoading"
              @input="handleOtpInput(index)"
              @keydown="handleKeyDown($event, index)"
            >
          </div>
        </div>

        <div>
          <button
            @click="handleVerification"
            :disabled="isLoading || !isOtpComplete"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Verifying...' : 'Verify Email' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Didn't receive the code?
            <button
              @click="handleResendOtp"
              :disabled="isResending || resendCooldown > 0"
              class="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
            </button>
          </p>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth-store'

// Page meta
definePageMeta({
  layout: 'auth'
})

// Store and router
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// State
const userEmail = ref(route.query.email as string || '')
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref<any[]>([])
const isLoading = ref(false)
const isResending = ref(false)
const resendCooldown = ref(0)
const error = ref('')
const successMessage = ref('')

// Computed
const isOtpComplete = computed(() => 
  otpDigits.value.every(digit => digit !== '')
)
const otpCode = computed(() => 
  otpDigits.value.join('')
)

// Handle OTP input
const handleOtpInput = (index: number) => {
  const value = otpDigits.value[index]
  
  // Only allow digits
  if (value && !/^\d$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }
  
  // Move to next input if value entered
  if (value && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
  
  // Auto-submit if all digits entered
  if (isOtpComplete.value) {
    handleVerification()
  }
}

// Handle key down events
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

// Handle verification
const handleVerification = async () => {
  if (!userEmail.value) {
    error.value = 'Email address is required'
    return
  }
  
  if (!isOtpComplete.value) {
    error.value = 'Please enter all 6 digits'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  const result = await authStore.verifyEmail(userEmail.value, otpCode.value)
  
  isLoading.value = false
  
  if (result.success) {
    successMessage.value = 'Email verified successfully! Redirecting...'
    setTimeout(() => {
      // Check if user is admin
      if (authStore.isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    }, 1500)
  } else {
    error.value = result.error || 'Verification failed'
    // Clear OTP fields on error
    otpDigits.value = ['', '', '', '', '', '']
    otpRefs.value[0]?.focus()
  }
}

// Handle resend OTP
const handleResendOtp = async () => {
  if (!userEmail.value) {
    error.value = 'Email address is required'
    return
  }
  
  isResending.value = true
  error.value = ''
  successMessage.value = ''
  
  const result = await authStore.resendOTP(userEmail.value)
  
  isResending.value = false
  
  if (result.success) {
    successMessage.value = 'Verification code sent successfully!'
    // Start cooldown timer
    resendCooldown.value = 60
    const timer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value === 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    // Clear OTP fields
    otpDigits.value = ['', '', '', '', '', '']
    otpRefs.value[0]?.focus()
  } else {
    error.value = result.error || 'Failed to resend code'
  }
}

// Focus first input on mount
onMounted(() => {
  otpRefs.value[0]?.focus()
})
</script>
