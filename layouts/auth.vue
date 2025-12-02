<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
    <!-- Simple Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center items-center h-16">
          <NuxtLink to="/" class="flex items-center">
            <h1 class="text-3xl font-bold text-indigo-600">RAIH</h1>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Auth layout - minimal layout for auth pages
</script>
