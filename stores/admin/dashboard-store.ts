import { defineStore } from 'pinia'
import { useAuthStore } from '../auth/auth-store'

interface DashboardStats {
  totalPayments: number
  totalEarnings: string
  totalCustomers: number
  totalProducts: number
  averageOrderValue: string
}

interface PaymentByDate {
  date: string
  amount: string
  count: number
}

interface TopProduct {
  productId: number
  name: string
  category: string
  salesCount: number
  revenue: string
}

interface CategoryDistribution {
  categoryId: number
  name: string
  productCount: number
}

interface RecentPayment {
  id: number
  amount: string
  customerName: string
  customerEmail: string
  productName: string
  createdAt: string
}

interface DashboardState {
  stats: DashboardStats
  paymentsByDate: PaymentByDate[]
  topProducts: TopProduct[]
  categoryDistribution: CategoryDistribution[]
  recentPayments: RecentPayment[]
  lastUpdated: string | null
  isLoading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: {
      totalPayments: 0,
      totalEarnings: '0',
      totalCustomers: 0,
      totalProducts: 0,
      averageOrderValue: '0'
    },
    paymentsByDate: [],
    topProducts: [],
    categoryDistribution: [],
    recentPayments: [],
    lastUpdated: null,
    isLoading: false,
    error: null
  }),

  getters: {
    formattedTotalEarnings: (state) => 
      `$${parseFloat(state.stats.totalEarnings).toFixed(2)}`,
    formattedAverageOrder: (state) => 
      `$${parseFloat(state.stats.averageOrderValue).toFixed(2)}`,
    hasData: (state) => 
      state.paymentsByDate.length > 0 || state.recentPayments.length > 0,
    chartData: (state) => ({
      labels: state.paymentsByDate.map(p => p.date),
      datasets: [{
        label: 'Revenue',
        data: state.paymentsByDate.map(p => parseFloat(p.amount)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    }),
    categoryChartData: (state) => ({
      labels: state.categoryDistribution.map(c => c.name),
      datasets: [{
        label: 'Products',
        data: state.categoryDistribution.map(c => c.productCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    })
  },

  actions: {
    // Fetch dashboard data
    async fetchDashboardData() {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated || !authStore.isAdmin) {
        this.error = 'Admin access required'
        return { success: false, error: this.error }
      }

      this.isLoading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/admin/dashboard/dashboard-data', {
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`
          }
        })

        // Update state with fetched data
        this.stats = data.data.stats
        this.paymentsByDate = data.data.charts.paymentsByDate
        this.topProducts = data.data.charts.topProducts
        this.categoryDistribution = data.data.charts.categoryDistribution
        this.recentPayments = data.data.recentPayments
        this.lastUpdated = data.data.lastUpdated

        return { success: true }
      } catch (error: any) {
        this.error = error.data?.message || 'Failed to fetch dashboard data'
        console.error('Fetch dashboard error:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // Refresh dashboard data
    async refreshData() {
      return await this.fetchDashboardData()
    },

    // Setup WebSocket for real-time updates
    setupWebSocket() {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated || !authStore.isAdmin) {
        return
      }

      // In production, this would connect to WebSocket endpoint
      // For now, simulate periodic updates
      const interval = setInterval(() => {
        this.fetchDashboardData()
      }, 30000) // Update every 30 seconds

      // Return cleanup function
      return () => clearInterval(interval)
    },

    // Clear dashboard data
    clearDashboard() {
      this.stats = {
        totalPayments: 0,
        totalEarnings: '0',
        totalCustomers: 0,
        totalProducts: 0,
        averageOrderValue: '0'
      }
      this.paymentsByDate = []
      this.topProducts = []
      this.categoryDistribution = []
      this.recentPayments = []
      this.lastUpdated = null
      this.error = null
    },

    // Clear error
    clearError() {
      this.error = null
    }
  }
})
