// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: true,
  
  // App configuration
  app: {
    head: {
      title: 'Raih E-Commerce',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Modern e-commerce platform built with Nuxt 3' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@prisma/nuxt',
    '@vueuse/nuxt',
    'nuxt-nodemailer'
  ],

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: ['~/assets/css/main.css'],
    configPath: 'tailwind.config.ts'
  },

  // Icon configuration
  icon: {
    serverBundle: {
      collections: ['ion']
    }
  },

  // Image optimization
  image: {
    quality: 80,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    }
  },

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**']
  },

  // Prisma configuration
  prisma: {
    autoSetupPrisma: true
  },

  // Nodemailer configuration
  nodemailer: {
    from: '"Raih E-Commerce" <noreply@raih.com>',
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASSWORD
    }
  },

  // Runtime configuration
  runtimeConfig: {
    // Private keys (server-side only)
    jwtTokenKey: process.env.JWT_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    xenditSecretKey: process.env.XENDIT_SECRET_KEY,
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client)
    public: {
      xenditPublicKey: process.env.XENDIT_PUBLIC_KEY,
      fallbackImgUrl: process.env.FALL_BACK_IMG_URL || 'https://via.placeholder.com/300',
      defaultUserAvatar: process.env.DEFAULT_USER_AVATAR || 'https://ui-avatars.com/api/'
    }
  },

  // Nitro server configuration
  nitro: {
    experimental: {
      websocket: true
    }
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Build configuration
  build: {
    transpile: ['vue-toast-notification', 'vue-sweetalert2', '@vuelidate/core', '@vuelidate/validators']
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['vue-toast-notification', 'vue-sweetalert2']
    }
  }
})
