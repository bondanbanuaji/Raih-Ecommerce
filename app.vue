<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { seoConfig } from '~/app/seo.config'

// Global SEO configuration
useHead({
  title: seoConfig.title,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: seoConfig.description },
    { name: 'keywords', content: seoConfig.keywords },
    { name: 'author', content: seoConfig.author },
    { name: 'robots', content: seoConfig.robots },
    
    // Open Graph
    { property: 'og:title', content: seoConfig.ogTitle },
    { property: 'og:description', content: seoConfig.ogDescription },
    { property: 'og:type', content: seoConfig.ogType },
    { property: 'og:url', content: seoConfig.siteUrl },
    { property: 'og:image', content: seoConfig.siteUrl + seoConfig.ogImage },
    { property: 'og:locale', content: seoConfig.locale },
    
    // Twitter
    { name: 'twitter:card', content: seoConfig.twitterCard },
    { name: 'twitter:site', content: seoConfig.twitterSite },
    { name: 'twitter:creator', content: seoConfig.twitterCreator },
    { name: 'twitter:title', content: seoConfig.ogTitle },
    { name: 'twitter:description', content: seoConfig.ogDescription },
    { name: 'twitter:image', content: seoConfig.siteUrl + seoConfig.ogImage },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: seoConfig.siteUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(seoConfig.structuredData)
    }
  ]
})

// Initialize stores on app mount
onMounted(() => {
  // Any global initialization
})
</script>
