<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Header -->
    <header class="bg-indigo-600 text-white">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold">RAIH Admin</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span>{{ authStore.userName }}</span>
            <button
              @click="handleLogout"
              class="px-3 py-1 bg-indigo-700 rounded hover:bg-indigo-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar Navigation -->
      <aside class="w-64 bg-white shadow-md min-h-screen">
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/admin/dashboard"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.path === '/admin/dashboard' }"
              >
                <Icon name="ion:grid-outline" class="h-5 w-5" />
                <span>Dashboard</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/products"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.path.startsWith('/admin/products') }"
              >
                <Icon name="ion:cube-outline" class="h-5 w-5" />
                <span>Products</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/categories"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.path === '/admin/categories' }"
              >
                <Icon name="ion:pricetags-outline" class="h-5 w-5" />
                <span>Categories</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/orders"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.path === '/admin/orders' }"
              >
                <Icon name="ion:receipt-outline" class="h-5 w-5" />
                <span>Orders</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/users"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.path === '/admin/users' }"
              >
                <Icon name="ion:people-outline" class="h-5 w-5" />
                <span>Users</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-100"
              >
                <Icon name="ion:storefront-outline" class="h-5 w-5" />
                <span>View Store</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth-store'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
