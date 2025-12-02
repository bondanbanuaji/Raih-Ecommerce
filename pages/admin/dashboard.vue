<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome back! Here's what's happening with your store.</p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardStore.isLoading" class="text-center py-12">
      <Icon name="ion:reload" class="h-8 w-8 animate-spin mx-auto text-indigo-600" />
      <p class="mt-2 text-gray-600">Loading dashboard data...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Revenue -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardStore.formattedTotalEarnings }}
              </p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <Icon name="ion:cash-outline" class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Total Orders -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Orders</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardStore.stats.totalPayments }}
              </p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Icon name="ion:cart-outline" class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Total Customers -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Customers</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardStore.stats.totalCustomers }}
              </p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Icon name="ion:people-outline" class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Average Order Value -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Avg. Order Value</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardStore.formattedAverageOrder }}
              </p>
            </div>
            <div class="p-3 bg-orange-100 rounded-full">
              <Icon name="ion:trending-up-outline" class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <div class="h-64 flex items-center justify-center">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>

        <!-- Top Products -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          <div class="space-y-3">
            <div
              v-for="product in dashboardStore.topProducts"
              :key="product.productId"
              class="flex items-center justify-between"
            >
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-sm text-gray-500">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">${{ product.revenue }}</p>
                <p class="text-sm text-gray-500">{{ product.salesCount }} sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="payment in dashboardStore.recentPayments"
                :key="payment.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{{ payment.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ payment.customerName }}</p>
                    <p class="text-sm text-gray-500">{{ payment.customerEmail }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ payment.productName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${{ payment.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(payment.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '~/stores/admin/dashboard-store'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

// Page meta
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

useHead({
  title: 'Dashboard - RAIH Admin',
})

// Store
const dashboardStore = useDashboardStore()

// Refs
const revenueChart = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Create revenue chart
const createRevenueChart = () => {
  if (!revenueChart.value) return
  
  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = revenueChart.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardStore.paymentsByDate.map(p => p.date),
      datasets: [{
        label: 'Revenue',
        data: dashboardStore.paymentsByDate.map(p => parseFloat(p.amount)),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value
            }
          }
        }
      }
    }
  })
}

// Initialize dashboard
onMounted(async () => {
  await dashboardStore.fetchDashboardData()
  
  // Create chart after data is loaded
  await nextTick()
  createRevenueChart()
  
  // Setup WebSocket for real-time updates
  const cleanup = dashboardStore.setupWebSocket()
  
  // Watch for data changes and update chart
  watch(() => dashboardStore.paymentsByDate, () => {
    createRevenueChart()
  })
  
  // Cleanup on unmount
  onUnmounted(() => {
    if (cleanup) cleanup()
    if (chartInstance) chartInstance.destroy()
  })
})
</script>
