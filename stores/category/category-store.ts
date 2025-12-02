import { defineStore } from 'pinia'

interface Category {
  id: number
  name: string
  productCount: number
  createdAt: string
  updatedAt: string
}

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    isLoading: false,
    error: null
  }),

  getters: {
    hasCategories: (state) => state.categories.length > 0,
    totalCategories: (state) => state.categories.length,
    categoriesWithProducts: (state) => 
      state.categories.filter(cat => cat.productCount > 0),
    getCategoryById: (state) => (id: number) =>
      state.categories.find(cat => cat.id === id),
    getCategoryByName: (state) => (name: string) =>
      state.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase())
  },

  actions: {
    // Fetch all categories
    async fetchCategories() {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/e-commerce/get-categories')
        this.categories = data.data.categories
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch categories'
        console.error('Fetch categories error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Admin: Fetch categories (with auth)
    async fetchAdminCategories(token: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/admin/category/get-categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.categories = data.data.categories
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch categories'
        console.error('Fetch admin categories error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Admin: Create new category
    async createCategory(name: string, token: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/admin/category/create', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: { name }
        })

        // Add new category to store
        const newCategory: Category = {
          id: data.data.id,
          name: data.data.name,
          productCount: 0,
          createdAt: data.data.createdAt,
          updatedAt: data.data.createdAt
        }
        this.categories.push(newCategory)

        return { success: true, category: newCategory }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to create category'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Admin: Update category
    async updateCategory(id: number, name: string, token: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/admin/category/update', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: { id, name }
        })

        // Update category in store
        const index = this.categories.findIndex(cat => cat.id === id)
        if (index !== -1) {
          this.categories[index] = {
            ...this.categories[index],
            name: data.data.name,
            updatedAt: data.data.updatedAt
          }
        }

        return { success: true }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to update category'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Admin: Delete category
    async deleteCategory(id: number, token: string) {
      this.isLoading = true
      this.error = null

      try {
        await $fetch('/api/admin/category/delete', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { id }
        })

        // Remove category from store
        const index = this.categories.findIndex(cat => cat.id === id)
        if (index !== -1) {
          this.categories.splice(index, 1)
        }

        return { success: true }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to delete category'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
