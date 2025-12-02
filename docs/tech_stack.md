# Tech Stack - E-Commerce Nuxt Application

## Ringkasan Arsitektur

Aplikasi E-Commerce ini dibangun menggunakan arsitektur **Full-Stack JavaScript/TypeScript** dengan pendekatan **Server-Side Rendering (SSR)** dan **API-First Architecture**. Stack teknologi dipilih untuk mengoptimalkan performa, keamanan, dan developer experience.

---

## 1. Frontend Stack

### 1.1 Framework & Library Utama

#### **Nuxt.js 3**
- **Deskripsi**: Meta-framework Vue.js dengan fitur SSR, SSG, dan Auto-Routing
- **Kegunaan**: Core framework aplikasi, menyediakan struktur project, routing otomatis, dan server-side rendering
- **Fitur yang Digunakan**:
  - File-based routing (`pages/` directory)
  - Auto-imports untuk components dan composables
  - Server API routes (`server/api/`)
  - Middleware system untuk authentication guard
  - Nitro engine untuk server deployment

#### **Vue.js 3**
- **Deskripsi**: Progressive JavaScript framework dengan Composition API
- **Kegunaan**: Library utama untuk membangun user interface reaktif
- **Fitur yang Digunakan**:
  - Composition API (`<script setup>`)
  - Reactive state management dengan `ref()` dan `reactive()`
  - Component-based architecture
  - Template syntax dan directives (v-for, v-if, v-show)

#### **Vue Router** 
- **Deskripsi**: Official routing library untuk Vue.js
- **Kegunaan**: Navigasi antar halaman, dynamic routing untuk product detail pages
- **Implementasi**: 
  - Dynamic routes: `/product/[slug].vue`
  - Navigation guards untuk protected routes
  - Query parameters untuk filter dan pagination

### 1.2 State Management

#### **Pinia**
- **Deskripsi**: Official state management library untuk Vue 3
- **Kegunaan**: Centralized state management untuk global data
- **Stores yang Diimplementasikan**:
  - `auth/signup-store.ts` - State registrasi dan verifikasi
  - `user/user-store.ts` - Data user authenticated
  - `product/product-store.ts` - State produk dan inventory
  - `category/category-store.ts` - State kategori produk
  - `e-commerce/shopping-cart-store.ts` - State keranjang belanja
  - `e-commerce/product-review-store.ts` - State review produk
  - `e-commerce/product-ecommerce-store.ts` - State produk e-commerce
  - `checkout/checkout-store.ts` - State proses checkout

#### **@pinia/nuxt** 
- **Deskripsi**: Nuxt module untuk integrasi Pinia
- **Kegunaan**: Auto-import stores dan SSR support

### 1.3 Styling & UI Framework

#### **Tailwind CSS** 
- **Deskripsi**: Utility-first CSS framework
- **Kegunaan**: Styling komponen dengan class-based approach
- **Konfigurasi**: `tailwind.config.ts` dengan custom theme
- **Plugins yang Digunakan**:
  - `@tailwindcss/typography` - Typography styles untuk content

#### **@nuxt/icon** 
- **Deskripsi**: Icon framework untuk Nuxt
- **Kegunaan**: Menampilkan icons dari berbagai icon sets
- **Konfigurasi**: Mode CSS dengan `@iconify-json/ion`

#### **@nuxt/image**
- **Deskripsi**: Image optimization module untuk Nuxt
- **Kegunaan**: Lazy loading, responsive images, dan format optimization

### 1.4 Form & Validation

#### **Vuelidate** 
- **Deskripsi**: Validation library untuk Vue
- **Kegunaan**: Client-side form validation
- **Package**:
  - `@vuelidate/core` - Core validation logic
  - `@vuelidate/validators` - Built-in validators (required, email, minLength, etc)

#### **@vueform/slider** 
- **Deskripsi**: Vue 3 slider component
- **Kegunaan**: Price range filter slider di halaman produk

#### **vue3-otp-input**
- **Deskripsi**: OTP input component untuk Vue 3
- **Kegunaan**: Input kode verifikasi 6 digit saat email verification

### 1.5 UI Components & Notifications

#### **Vue SweetAlert2** 
- **Deskripsi**: Beautiful, responsive, customizable popup boxes
- **Kegunaan**: Confirmation dialogs untuk delete actions, success/error alerts

#### **Vue Toast Notification** 
- **Deskripsi**: Toast notification library untuk Vue 3
- **Kegunaan**: Menampilkan feedback notifications (success, error, warning, info)

### 1.6 Utilities

#### **@vueuse/core** 
- **Deskripsi**: Collection of essential Vue Composition Utilities
- **Kegunaan**: Helper composables seperti `useLocalStorage`, `useFetch`, `useDebounce`

---

## 2. Backend Stack

### 2.1 Server & Runtime

#### **Nuxt Nitro Server**
- **Deskripsi**: Built-in server engine Nuxt 3
- **Kegunaan**: Server-side rendering, API routes, middleware
- **Fitur**:
  - Universal deployment (Node.js, Serverless, Edge)
  - WebSocket support (experimental)
  - Auto-import utilities

### 2.2 Database & ORM

#### **Prisma** 
- **Deskripsi**: Next-generation ORM untuk Node.js & TypeScript
- **Kegunaan**: Database schema definition, query builder, migrations
- **Fitur yang Digunakan**:
  - Schema definition (`prisma/schema.prisma`)
  - Type-safe query builder
  - Relation queries dengan `include`
  - Aggregations dan grouping
  - Transaction support

#### **@prisma/client** 
- **Deskripsi**: Auto-generated database client
- **Kegunaan**: Runtime query execution
- **Konfigurasi**:
  - Output: `generated/prisma` (custom location)
  - Module format: ESM
  - Binary targets: native, windows, debian-openssl-3.0.x

#### **MySQL**
- **Deskripsi**: Relational database management system
- **Kegunaan**: Primary database untuk menyimpan data aplikasi
- **Koneksi**: Via environment variable `DATABASE_URL`

### 2.3 Authentication & Security

#### **JSON Web Token (jsonwebtoken)** 
- **Deskripsi**: Library untuk generate dan verify JWT
- **Kegunaan**: 
  - Generate Access Token (expired 1 jam)
  - Generate Refresh Token (expired 7 hari)
  - Verify token di middleware authentication
- **Implementation**: `utils/jwtToken.ts`

#### **bcrypt** 
- **Deskripsi**: Password hashing library
- **Kegunaan**: 
  - Hash password saat registrasi
  - Compare password saat login
- **Configuration**: Salt rounds untuk security level
- **Implementation**: `server/api/auth/modules/bcrypt.ts`

#### **Zod** 
- **Deskripsi**: TypeScript-first schema validation
- **Kegunaan**: 
  - Server-side input validation untuk semua API endpoints
  - Type inference untuk TypeScript
- **Schemas**:
  - `signupSchema` - Validasi registrasi
  - `signInSchema` - Validasi login
  - `productSchema` - Validasi data produk
  - `categorySchema` - Validasi kategori
  - `reviewSchema` - Validasi review

### 2.4 File Upload

#### **Multer** 
- **Deskripsi**: Middleware untuk handling multipart/form-data
- **Kegunaan**: Upload gambar produk ke server
- **Implementation**: `server/api/admin/product/upload-image.ts`
- **Storage**: File system di folder `public/uploads/`

### 2.5 Utilities

#### **Slugify** 
- **Deskripsi**: Convert string ke URL-friendly slug
- **Kegunaan**: Generate slug dari nama produk untuk SEO-friendly URLs
- **Implementation**: `server/api/admin/product/modules/slugifyProductName.ts`

---

## 3. Payment Integration

### 3.1 Payment Gateway

#### **@unlok-co/nuxt-Xendit**
- **Deskripsi**: Nuxt module untuk Xendit integration
- **Kegunaan**: 
  - Client-side: Xendit Elements untuk payment form
  - Server-side: Payment Intent creation dan customer management
- **Konfigurasi**:
  - Server Key: `Xendit_SECRET_KEY`
  - Client Key: `Xendit_PUBLIC_KEY`

#### **Xendit API Features**
- **Payment Intents**: Create payment dengan automatic payment methods
- **Customer Management**: Create customer object dengan email
- **Currency**: USD (United States Dollar)
- **Amount Conversion**: Price * 100 untuk cents format

---

## 4. Email Service

### 4.1 Email Client

#### **Nuxt Nodemailer** (v1.1.2)
- **Deskripsi**: Nuxt module untuk Nodemailer integration
- **Kegunaan**: Mengirim email transactional
- **Konfigurasi**:
  - From: `"E-commerce app" <noreply@app.com>`
  - Host: `MAIL_HOST`
  - Port: `MAIL_PORT`
  - Auth: `MAIL_TRAP_USER`, `MAIL_TRAP_PASSWORD`

#### **Nodemailer** (v6.10.1)
- **Deskripsi**: Email sending library untuk Node.js
- **Kegunaan**: Send email verification OTP
- **Implementation**: `server/api/auth/modules/send-email-verification.ts`

---

## 5. Visualization & Charts

### 5.1 Data Visualization

#### **Chart.js** 
- **Deskripsi**: JavaScript charting library
- **Kegunaan**: Visualisasi data di admin dashboard
- **Chart Types**:
  - Line chart untuk payment trends by date
  - Bar chart untuk statistik pembayaran
- **Implementation**: Admin dashboard components

---

## 6. Development Tools

### 6.1 Language & Runtime

#### **TypeScript**
- **Deskripsi**: Typed superset of JavaScript
- **Kegunaan**: Type safety, better IDE support, code documentation
- **Configuration**: `tsconfig.json`
- **Files**: `.ts` dan `.vue` files dengan `<script setup lang="ts">`

#### **Node.js**
- **Runtime**: Server-side JavaScript execution
- **Version**: Compatible dengan Nuxt 3 (Node 18+)

### 6.2 Build Tools

#### **Vite**
- **Deskripsi**: Next-generation frontend build tool (built-in Nuxt 3)
- **Kegunaan**: Fast development server, HMR, optimized production builds

#### **PostCSS**
- **Deskripsi**: CSS transformation tool
- **Plugins**:
  - `postcss-color-gray` (v5.0.0) - Color manipulation

### 6.3 CSS Preprocessor

#### **Sass** 
- **Deskripsi**: CSS preprocessor
- **Kegunaan**: Advanced styling dengan variables, mixins, nesting
- **Implementation**: Component-level styles

---

## 7. Deployment & Environment

### 7.1 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secrets
JWT_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret

# Email Service
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_TRAP_USER=your_mailtrap_username
MAIL_TRAP_PASSWORD=your_mailtrap_password

# Xendit
Xendit_SECRET_KEY=sk_test_xxxxx
Xendit_PUBLIC_KEY=pk_test_xxxxx

# Public Assets
FALL_BACK_IMG_URL=https://via.placeholder.com/300
DEFAULT_USER_AVATAR=https://ui-avatars.com/api/
```

### 7.2 Build & Deployment

#### **Build Commands**
- `npm run dev` - Development server dengan HMR
- `npm run build` - Production build
- `npm run generate` - Static site generation
- `npm run preview` - Preview production build
- `npm start` - Start production server (`node .output/server/index.mjs`)

#### **Deployment Targets**
- **Node.js Server**: Traditional server deployment
- **Serverless**: Vercel, Netlify, AWS Lambda
- **Edge**: Cloudflare Workers, Vercel Edge
- **Static Hosting**: Netlify, Vercel (dengan `nuxt generate`)

---

## 8. Database Schema (Prisma Models)

### 8.1 Entities

#### **User**
- id (Int, Primary Key, Auto-increment)
- email (String, Unique)
- isValidEmail (Int) - 0: Invalid, 1: Valid
- otpCode (String) - 6 digit verification code
- name (String, Nullable)
- password (String) - Bcrypt hashed
- role (String, Nullable) - ADMIN / CUSTOMER
- **Relations**: reviews, payments

#### **Category**
- id (Int, Primary Key, Auto-increment)
- name (String, Unique)
- **Relations**: products

#### **Product**
- id (Int, Primary Key, Auto-increment)
- name (String)
- slug (String, Nullable) - SEO-friendly URL
- color (String)
- price (Decimal) - db.Decimal(10, 2)
- categoryId (Int, Foreign Key)
- createdAt (DateTime, Default: now)
- updatedAt (DateTime, Auto-update)
- **Relations**: category, images, reviews, stars, starPercents, payments

#### **Image**
- id (Int, Primary Key, Auto-increment)
- url (String) - Path atau URL gambar
- productId (Int, Foreign Key)
- **Relations**: product

#### **ProductReview**
- id (Int, Primary Key, Auto-increment)
- userId (Int, Foreign Key)
- starNumber (Int) - Rating 1-5
- productId (Int, Foreign Key)
- comment (String)
- createdAt (DateTime, Default: now)
- updatedAt (DateTime, Auto-update)
- **Relations**: user, product

#### **productStar**
- id (Int, Primary Key, Auto-increment)
- productId (Int, Foreign Key)
- receivedStars (Int) - Total accumulated stars
- createdAt (DateTime, Default: now)
- updatedAt (DateTime, Auto-update)
- **Relations**: product

#### **productStarPercent**
- id (Int, Primary Key, Auto-increment)
- productId (Int, Foreign Key)
- times (Int) - Counter berapa kali rating ini diberikan
- star (Int) - Rating value (1-5)
- createdAt (DateTime, Default: now)
- updatedAt (DateTime, Auto-update)
- **Relations**: product

#### **payment**
- id (Int, Primary Key, Auto-increment)
- productId (Int, Foreign Key)
- userId (Int, Foreign Key)
- amount (Decimal) - db.Decimal(10, 2)
- createdAt (DateTime, Default: now)
- updatedAt (DateTime, Auto-update)
- **Relations**: product, user

## 10. API Endpoints Overview

### 10.1 Public APIs (No Auth Required)

#### **E-Commerce**
- `GET /api/e-commerce/get-product` - List produk dengan filter & pagination
- `GET /api/e-commerce/single-product` - Detail produk by ID/slug
- `GET /api/e-commerce/get-product-reviews` - Reviews produk
- `GET /api/e-commerce/get-same-category-product` - Related products
- `POST /api/e-commerce/create-review` - Submit review (auth required)

#### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/email-verification` - Verify OTP code

### 10.2 Protected APIs (Auth Required)

#### **Payment**
- `POST /api/payment/create-payment` - Create Xendit payment intent
- `GET /api/payment/get-payments` - User's payment history

### 10.3 Admin APIs (Admin Role Required)

#### **Products**
- `GET /api/admin/product/get` - List all products
- `POST /api/admin/product/create` - Create product
- `PUT /api/admin/product/update` - Update product
- `DELETE /api/admin/product/delete` - Delete product
- `POST /api/admin/product/upload-image` - Upload product images

#### **Categories**
- `GET /api/admin/category/get-categories` - List categories
- `POST /api/admin/category/create-category` - Create category
- `PUT /api/admin/category/update-category` - Update category

#### **Dashboard**
- `GET /api/admin/dashboard/dashboard-data` - Analytics data
- `WS /api/admin/dashboard/_ws` - WebSocket real-time updates

#### **Users & Payments**
- `GET /api/admin/user/get` - List all users
- `GET /api/admin/payment/all-payments` - All payment transactions

---

## 11. Security Implementations

### 11.1 Authentication Security
- Password hashing dengan bcrypt (salt rounds)
- JWT dengan expiration time (Access: 1h, Refresh: 7d)
- OTP verification untuk email validation
- Secure token storage di localStorage dengan encryption

### 11.2 API Security
- Input validation dengan Zod schemas
- Authorization middleware (`withAuth()`)
- Role-based access control (RBAC)
- CORS configuration untuk allowed origins

### 11.3 Data Security
- Environment variables untuk sensitive data
- SQL injection prevention via Prisma ORM
- XSS protection via Vue template escaping
- CSRF protection (jika diperlukan)

### 11.4 Payment Security
- PCI DSS compliance via Xendit
- No credit card data stored in database
- Secure webhook handling untuk payment confirmation
- Amount validation sebelum create payment intent

---

## 12. Performance Optimizations

### 12.1 Frontend
- **Lazy Loading**: Components dan routes
- **Image Optimization**: @nuxt/image untuk auto-optimization
- **Code Splitting**: Auto by Nuxt/Vite
- **CSS Purging**: Tailwind JIT mode untuk small bundle size
- **Caching**: LocalStorage untuk cart data

### 12.2 Backend
- **Database Indexing**: Pada email, slug, categoryId
- **Query Optimization**: Prisma select specific fields
- **Parallel Queries**: Promise.all untuk multiple queries
- **Connection Pooling**: Prisma connection management

### 12.3 SSR & SEO
- Server-Side Rendering untuk faster initial load
- Dynamic meta tags untuk SEO (product pages)
- Structured data untuk rich snippets
- Sitemap generation untuk search engines

---

## 13. Dependencies Summary

### Production Dependencies (26 packages)
| Package | Version | Purpose |
|---------|---------|---------|
| nuxt | ^3.16.2 | Core framework |
| vue | ^3.5.13 | UI library |
| pinia | ^3.0.2 | State management |
| @prisma/nuxt | ^0.3.0 | Database ORM module |
| @nuxtjs/tailwindcss | ^6.13.2 | CSS framework |
| @unlok-co/nuxt-Xendit | ^5.0.0 | Payment integration |
| jsonwebtoken | ^9.0.2 | Authentication |
| bcrypt | ^5.1.1 | Password hashing |
| zod | ^3.24.3 | Input validation |
| multer | ^1.4.5-lts.2 | File upload |
| slugify | ^1.6.6 | URL slug generation |
| chart.js | ^4.4.9 | Data visualization |
| vue-sweetalert2 | ^5.0.11 | Alert dialogs |
| vue-toast-notification | ^3.1.3 | Notifications |
| @vuelidate/core | ^2.0.3 | Form validation |
| @vueuse/core | ^13.1.0 | Vue utilities |

### Development Dependencies (5 packages)
| Package | Version | Purpose |
|---------|---------|---------|
| @prisma/client | ^6.8.2 | Prisma runtime |
| prisma | ^6.8.2 | Prisma CLI |
| nuxt-nodemailer | ^1.1.2 | Email sending |
| nodemailer | ^6.10.1 | Email library |
| sass-embedded | ^1.87.0 | CSS preprocessor |

---

## 14. Browser & Platform Support

### Minimum Requirements
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Mobile Support
- Responsive design dengan Tailwind breakpoints
- Touch-friendly UI elements
- Mobile-optimized images

---

## Kesimpulan

Stack teknologi ini dipilih dengan pertimbangan:
✅ **Modern & Maintained**: Semua library actively maintained dengan update reguler
✅ **Type Safety**: TypeScript + Zod untuk runtime validation
✅ **Developer Experience**: Auto-imports, HMR, TypeScript support
✅ **Performance**: SSR, image optimization, code splitting
✅ **Security**: JWT, bcrypt, input validation, PCI compliance via Xendit
✅ **Scalability**: Prisma ORM, connection pooling, modular architecture
✅ **SEO Friendly**: SSR, dynamic meta tags, clean URLs dengan slug