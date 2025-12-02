<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <NuxtLink to="/" class="flex items-center">
              <h1 class="text-2xl font-bold text-indigo-600">RAIH</h1>
            </NuxtLink>
          </div>

          <!-- Search Bar -->
          <div class="flex-1 max-w-xl mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search products..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="ion:search" class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- Navigation Items -->
          <div class="flex items-center space-x-4">
            <!-- Categories -->
            <NuxtLink to="/categories" class="text-gray-700 hover:text-indigo-600">
              Categories
            </NuxtLink>

            <!-- Cart -->
            <button
              @click="toggleCart"
              class="relative p-2 text-gray-700 hover:text-indigo-600"
            >
              <Icon name="ion:cart-outline" class="h-6 w-6" />
              <span
                v-if="cartItemsCount > 0"
                class="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ cartItemsCount }}
              </span>
            </button>

            <!-- User Menu -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
              >
                <Icon name="ion:person-circle-outline" class="h-6 w-6" />
                <span class="hidden sm:block">{{ authStore.userName }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <NuxtLink
                  v-if="authStore.isAdmin"
                  to="/admin/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Admin Dashboard
                </NuxtLink>
                <NuxtLink
                  to="/account/orders"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  My Orders
                </NuxtLink>
                <NuxtLink
                  to="/account/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  Profile
                </NuxtLink>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>

            <!-- Login/Register -->
            <div v-else class="flex items-center space-x-2">
              <NuxtLink
                to="/auth/signin"
                class="px-4 py-2 text-gray-700 hover:text-indigo-600"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/auth/signup"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Sign Up
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Shopping Cart Sidebar -->
    <ShoppingCartSidebar />

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">About RAIH</h3>
            <p class="text-gray-400 text-sm">
              Your trusted e-commerce platform for quality products and excellent service.
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="text-gray-400 text-sm space-y-2">
              <li><NuxtLink to="/about" class="hover:text-white">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink></li>
              <li><NuxtLink to="/faq" class="hover:text-white">FAQ</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
            <ul class="text-gray-400 text-sm space-y-2">
              <li><NuxtLink to="/shipping" class="hover:text-white">Shipping Info</NuxtLink></li>
              <li><NuxtLink to="/returns" class="hover:text-white">Returns</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="hover:text-white">Privacy Policy</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Connect</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white">
                <Icon name="ion:logo-facebook" class="h-6 w-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <Icon name="ion:logo-twitter" class="h-6 w-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-white">
                <Icon name="ion:logo-instagram" class="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; 2024 RAIH E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth-store'
import { useShoppingCartStore } from '~/stores/e-commerce/shopping-cart-store'
import { useProductStore } from '~/stores/product/product-store'

// Stores
const authStore = useAuthStore()
const cartStore = useShoppingCartStore()
const productStore = useProductStore()
const router = useRouter()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)

// Computed
const cartItemsCount = computed(() => cartStore.totalQuantity)

// Methods
const toggleCart = () => {
  cartStore.toggleCart()
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    productStore.setSearchFilter(searchQuery.value)
    router.push('/')
  }
}

const handleLogout = () => {
  showUserMenu.value = false
  authStore.logout()
}

// Initialize stores on mount
onMounted(() => {
  authStore.initAuth()
  cartStore.initCart()
})

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>
