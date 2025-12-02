<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="mt-2 text-gray-600">Manage your product inventory</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Add New Product
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          >
        </div>
        <button
          @click="fetchProducts"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Search
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stats
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="5" class="px-6 py-4 text-center">
              <Icon name="ion:reload" class="h-6 w-6 animate-spin mx-auto text-indigo-600" />
              <p class="mt-2 text-gray-600">Loading products...</p>
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              No products found
            </td>
          </tr>
          <tr v-else v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <NuxtImg
                  :src="product.images[0]?.url || '/placeholder.jpg'"
                  :alt="product.name"
                  class="h-10 w-10 rounded object-cover"
                />
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-500">{{ product.color }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ product.category.name }}
            </td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">
              ${{ product.price }}
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                <p>{{ product.stats.orderCount }} orders</p>
                <p class="text-gray-500">★ {{ product.stats.averageRating }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2">
                <button
                  @click="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  @click="deleteProduct(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t">
        <nav class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
            {{ pagination.total }} results
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Create/Edit Product Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="fixed inset-0 bg-black opacity-30" @click="closeModals"></div>
          
          <div class="relative bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 class="text-xl font-semibold mb-4">
              {{ showCreateModal ? 'Create New Product' : 'Edit Product' }}
            </h2>

            <form @submit.prevent="saveProduct">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    v-model="productForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <input
                      v-model="productForm.color"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      v-model.number="productForm.price"
                      type="number"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    v-model="productForm.categoryId"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select a category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    @change="handleFileSelect"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                  <p class="text-xs text-gray-500 mt-1">Select multiple images for your product</p>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModals"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSaving ? 'Saving...' : 'Save Product' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/auth-store'
import { useCategoryStore } from '~/stores/category/category-store'

// Page meta
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({
  title: 'Products - RAIH Admin',
})

// Stores
const authStore = useAuthStore()
const categoryStore = useCategoryStore()

// State
const products = ref<any[]>([])
const categories = computed(() => categoryStore.categories)
const searchQuery = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedFiles = ref<File[]>([])

const productForm = reactive({
  id: null as number | null,
  name: '',
  color: '',
  price: 0,
  categoryId: null as number | null
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

// Fetch products
const fetchProducts = async () => {
  isLoading.value = true
  
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const { data } = await $fetch('/api/admin/product/get-products', {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      },
      params
    })

    products.value = data.data.products
    pagination.total = data.data.pagination.total
    pagination.totalPages = data.data.pagination.totalPages
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files)
  }
}

// Upload images
const uploadImages = async (): Promise<string[]> => {
  if (selectedFiles.value.length === 0) return []

  const formData = new FormData()
  selectedFiles.value.forEach(file => {
    formData.append('images', file)
  })

  try {
    const { data } = await $fetch('/api/admin/product/upload-images', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      },
      body: formData
    })

    return data.data.images.map((img: any) => img.url)
  } catch (error) {
    console.error('Failed to upload images:', error)
    return []
  }
}

// Save product (create or update)
const saveProduct = async () => {
  isSaving.value = true

  try {
    // Upload images if any
    const imageUrls = await uploadImages()

    const productData = {
      name: productForm.name,
      color: productForm.color,
      price: productForm.price,
      categoryId: productForm.categoryId,
      images: imageUrls
    }

    if (productForm.id) {
      // Update product
      await $fetch('/api/admin/product/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: {
          id: productForm.id,
          ...productData
        }
      })
    } else {
      // Create product
      await $fetch('/api/admin/product/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: productData
      })
    }

    closeModals()
    await fetchProducts()
  } catch (error) {
    console.error('Failed to save product:', error)
  } finally {
    isSaving.value = false
  }
}

// Edit product
const editProduct = (product: any) => {
  productForm.id = product.id
  productForm.name = product.name
  productForm.color = product.color
  productForm.price = parseFloat(product.price)
  productForm.categoryId = product.category.id
  showEditModal.value = true
}

// Delete product
const deleteProduct = async (product: any) => {
  if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return

  try {
    await $fetch('/api/admin/product/delete', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      },
      params: { id: product.id }
    })

    await fetchProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

// Change page
const changePage = (page: number) => {
  pagination.page = page
  fetchProducts()
}

// Close modals
const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  productForm.id = null
  productForm.name = ''
  productForm.color = ''
  productForm.price = 0
  productForm.categoryId = null
  selectedFiles.value = []
}

// Initialize
onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    categoryStore.fetchAdminCategories(authStore.accessToken!)
  ])
})
</script>
