export const seoConfig = {
  title: 'RAIH - Your Trusted E-Commerce Platform',
  description: 'Discover amazing products at RAIH. Shop the latest trends with secure payment and fast delivery. Quality products, excellent service.',
  keywords: 'e-commerce, online shopping, quality products, secure payment, fast delivery, RAIH store',
  author: 'RAIH E-Commerce',
  siteUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://raih.com',
  
  // Open Graph
  ogTitle: 'RAIH - Quality Products Online',
  ogDescription: 'Shop the latest trends at RAIH. Secure payment, fast delivery, excellent service.',
  ogImage: '/og-image.jpg',
  ogType: 'website',
  
  // Twitter
  twitterCard: 'summary_large_image',
  twitterSite: '@raih_store',
  twitterCreator: '@raih_store',
  
  // Additional
  locale: 'en_US',
  robots: 'index, follow',
  
  // Structured Data
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RAIH E-Commerce',
    url: process.env.NUXT_PUBLIC_BASE_URL || 'https://raih.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NUXT_PUBLIC_BASE_URL || 'https://raih.com'}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}
