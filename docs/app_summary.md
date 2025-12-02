# Dokumentasi Spesifikasi Fungsional Aplikasi E-Commerce Nuxt "Raih"

## 1. Pendahuluan

### 1.1 Latar Belakang

Aplikasi E-Commerce Nuxt adalah platform perdagangan elektronik berbasis web yang dikembangkan untuk memfasilitasi transaksi jual beli produk secara online. Aplikasi ini dibangun dengan teknologi modern menggunakan Nuxt.js 3 sebagai framework frontend, Prisma sebagai ORM database dan MySQL sebagai database, serta integrasi pembayaran melalui Xendit. Sistem ini dirancang untuk menyelesaikan kebutuhan bisnis e-commerce dengan menyediakan katalog produk, sistem keranjang belanja, pemrosesan pembayaran, dan panel administrasi untuk manajemen konten.

### 1.2 Tujuan

Tujuan utama aplikasi ini adalah menyediakan platform e-commerce yang aman, responsif, dan mudah digunakan untuk:
- Memungkinkan pengunjung menjelajahi dan mencari produk dengan berbagai filter
- Memfasilitasi proses pembelian produk dengan sistem pembayaran yang terintegrasi
- Memberikan pelanggan kemampuan untuk memberikan ulasan dan penilaian produk
- Menyediakan administrator dengan tools untuk mengelola produk, kategori, dan memantau transaksi
- Meningkatkan pengalaman berbelanja online dengan antarmuka yang intuitif dan sistem keamanan yang robust

### 1.3 Ruang Lingkup

Aplikasi ini mencakup modul-modul utama sebagai berikut:
- **Modul Autentikasi**: Registrasi pengguna dengan verifikasi email OTP, login dengan JWT token
- **Modul Katalog Produk**: Browsing produk, pencarian, filtering berdasarkan kategori, warna, harga, dan rating
- **Modul Keranjang Belanja**: Manajemen keranjang belanja dengan penyimpanan lokal
- **Modul Checkout & Pembayaran**: Integrasi dengan Xendit untuk pemrosesan pembayaran
- **Modul Review Produk**: Sistem rating dan ulasan produk oleh pelanggan
- **Modul Administrasi**: Dashboard analytics, CRUD produk, CRUD kategori, manajemen pengguna, dan laporan pembayaran

**Batasan**: Aplikasi ini tidak mencakup sistem pengiriman logistik, integrasi multi-marketplace, atau fitur chat customer service real-time.

## 2. Aktor Sistem (Role)

### 2.1 Customer (User)

Customer adalah pengguna yang telah melakukan registrasi dan verifikasi email melalui kode OTP. Role ini memiliki kemampuan:
- Mengakses semua fitur yang tersedia untuk Guest
- Melakukan checkout dan pembayaran produk melalui gateway Xendit
- Menulis review dan memberikan rating bintang (1-5) untuk produk yang dibeli
- Melihat riwayat transaksi pembayaran pribadi
- Mengelola profil akun pribadi

**Batasan**: Customer hanya dapat memberikan satu review per produk dan harus terautentikasi untuk melakukan transaksi pembayaran.

### 2.2 Admin

Admin adalah pengguna dengan hak akses penuh terhadap sistem manajemen aplikasi. Role ini memiliki kemampuan dan tanggung jawab:
- Mengakses dashboard analytics dengan statistik real-time (total pendapatan, jumlah pembayaran, jumlah customer, grafik pembayaran berdasarkan tanggal)
- Melakukan operasi CRUD (Create, Read, Update, Delete) pada produk termasuk upload gambar produk
- Melakukan operasi CRUD pada kategori produk
- Melihat seluruh daftar pengguna (customers) yang terdaftar
- Melihat seluruh riwayat transaksi pembayaran dari semua customer
- Mengelola data produk termasuk nama, slug, warna, harga, dan kategori

**Tanggung Jawab**: Admin bertanggung jawab untuk menjaga integritas data produk, memastikan kategori terorganisir dengan baik, dan memantau aktivitas transaksi.

### 2.3 Guest (Tanpa Login dan Register)

Guest adalah pengunjung yang belum melakukan registrasi atau login ke dalam sistem. Role ini memiliki kemampuan terbatas:
- Menjelajahi katalog produk dengan pagination
- Menggunakan fitur pencarian produk berdasarkan nama
- Menerapkan filter produk berdasarkan kategori, warna, rentang harga, dan rating bintang
- Melihat detail produk termasuk gambar, deskripsi, harga, dan warna
- Melihat review dan rating produk dari customer lain
- Melihat produk terkait dalam kategori yang sama
- Menambahkan produk ke keranjang belanja (disimpan di localStorage browser)
- Mengubah kuantitas produk di keranjang belanja

**Batasan**: Guest tidak dapat melakukan checkout, pembayaran, atau menulis review produk. Untuk mengakses fitur tersebut, Guest harus melakukan registrasi dan login terlebih dahulu.

## 3. Fitur Utama

### 3.1 Fitur untuk Customer (User)

#### 3.1.1 Autentikasi dan Manajemen Akun
- **Registrasi Akun**: Pendaftaran dengan email, nama, dan password yang di-hash menggunakan bcrypt
- **Verifikasi Email**: Sistem OTP (One-Time Password) 6 digit dikirim melalui email untuk validasi akun
- **Login**: Autentikasi menggunakan JWT (Access Token dan Refresh Token)
- **Logout**: Penghapusan sesi autentikasi

#### 3.1.2 Browsing dan Pencarian Produk
- **Katalog Produk**: Menampilkan grid produk dengan pagination (10 produk per halaman)
- **Pencarian**: Pencarian produk berdasarkan nama (case-insensitive)
- **Filter Multi-Kriteria**: 
  - Filter berdasarkan satu atau beberapa kategori
  - Filter berdasarkan warna produk
  - Filter berdasarkan rentang harga (minimum dan maksimum)
  - Filter berdasarkan rating bintang (1-5 bintang)
- **Detail Produk**: Melihat informasi lengkap produk termasuk gambar, nama, harga, warna, kategori, dan statistik review

#### 3.1.3 Keranjang Belanja
- **Tambah ke Keranjang**: Menambahkan produk dengan kuantitas default (1) ke keranjang
- **Ubah Kuantitas**: Menambah atau mengurangi jumlah produk di keranjang
- **Hapus dari Keranjang**: Menghapus item produk dari keranjang
- **Kalkulasi Total**: Perhitungan otomatis total harga berdasarkan kuantitas dan harga produk
- **Penyimpanan Lokal**: Data keranjang tersimpan di localStorage browser untuk persistensi

#### 3.1.4 Checkout dan Pembayaran
- **Proses Checkout**: Melanjutkan ke halaman pembayaran dengan data keranjang
- **Integrasi Xendit**: Pemrosesan pembayaran kartu kredit/debit melalui Xendit Payment Intent
- **Konfirmasi Pembayaran**: Validasi dan penyimpanan data transaksi ke database
- **Konversi Mata Uang**: Tampilan harga dalam format USD
- **Riwayat Transaksi**: Melihat daftar pembayaran yang telah dilakukan

#### 3.1.5 Review dan Rating Produk
- **Menulis Review**: Memberikan komentar dan rating bintang (1-5) untuk produk
- **Validasi Review**: Sistem mencegah customer memberikan lebih dari satu review per produk
- **Perhitungan Rating**: Sistem otomatis menghitung dan memperbarui statistik rating produk
- **Persentase Rating**: Tracking berapa kali setiap level bintang diberikan untuk analisis

### 3.2 Fitur untuk Admin

#### 3.2.1 Dashboard Analytics
- **Total Pendapatan**: Agregasi total amount dari seluruh transaksi pembayaran
- **Jumlah Transaksi**: Hitung total pembayaran yang telah diproses
- **Jumlah Customer**: Hitung total pengguna dengan role CUSTOMER
- **Grafik Pembayaran**: Visualisasi pembayaran berdasarkan tanggal pembuatan (chart.js)
- **Real-time Updates**: WebSocket connection untuk pembaruan data dashboard secara real-time

#### 3.2.2 Manajemen Produk (CRUD)
- **Tambah Produk Baru**: 
  - Input nama, warna, harga, dan kategori produk
  - Generasi slug otomatis dari nama produk menggunakan library slugify
  - Validasi input menggunakan Zod schema
  - Upload multiple gambar produk melalui Multer
- **Lihat Daftar Produk**: 
  - Tampilan tabel produk dengan informasi lengkap
  - Include relasi kategori, gambar, dan statistik review
- **Edit Produk**: 
  - Update informasi produk (nama, warna, harga, kategori)
  - Regenerasi slug jika nama berubah
- **Hapus Produk**: 
  - Soft atau hard delete produk dari sistem
  - Cascade delete untuk relasi gambar dan review

#### 3.2.3 Manajemen Kategori (CRUD)
- **Tambah Kategori Baru**: 
  - Input nama kategori dengan validasi unique constraint
  - Validasi input menggunakan Zod schema
- **Lihat Daftar Kategori**: 
  - Tampilan list semua kategori
- **Edit Kategori**: 
  - Update nama kategori
- **Hapus Kategori**: 
  - Delete kategori (jika tidak memiliki produk terkait)

#### 3.2.4 Manajemen Pembayaran
- **Lihat Semua Transaksi**: 
  - Tampilan tabel seluruh transaksi pembayaran
  - Include informasi user, produk, amount, dan timestamp
  - Filter dan sorting berdasarkan tanggal
- **Detail Transaksi**: 
  - Melihat informasi lengkap transaksi termasuk data customer dan produk

#### 3.2.5 Manajemen Pengguna
- **Lihat Daftar User**: 
  - Tampilan tabel seluruh pengguna terdaftar
  - Informasi email, nama, role, dan status verifikasi email

### 3.3 Fitur untuk Guest

#### 3.3.1 Browsing Produk
- **Katalog Produk**: Akses ke grid produk dengan pagination
- **Grid View**: Tampilan card produk dengan gambar, nama, harga, dan rating
- **Responsive Design**: Adaptif terhadap berbagai ukuran layar

#### 3.3.2 Pencarian dan Filter
- **Pencarian Produk**: Fitur search bar untuk mencari produk berdasarkan nama
- **Filter Kategori**: Checkbox multiple selection untuk filter berdasarkan kategori
- **Filter Warna**: Selection untuk filter berdasarkan warna produk
- **Filter Harga**: Slider range untuk menentukan rentang harga minimum dan maksimum
- **Filter Rating**: Filter produk berdasarkan rating bintang (1-5)
- **Kombinasi Filter**: Kemampuan menggunakan multiple filter secara bersamaan

#### 3.3.3 Detail dan Informasi Produk
- **Halaman Detail**: Navigasi ke halaman detail produk melalui slug URL
- **Galeri Gambar**: Tampilan multiple gambar produk
- **Informasi Lengkap**: Nama, harga, warna, kategori, dan deskripsi produk
- **Statistik Review**: 
  - Jumlah total review
  - Rating rata-rata dalam bintang
  - Persentase distribusi rating (berapa % rating 5 bintang, 4 bintang, dst)
- **Daftar Review**: Melihat komentar dan rating dari customer lain
- **Produk Terkait**: Rekomendasi produk lain dalam kategori yang sama

#### 3.3.4 Keranjang Belanja (Tanpa Checkout)
- **Tambah ke Keranjang**: Menambahkan produk ke shopping cart localStorage
- **Toggle Cart**: Membuka/menutup sidebar keranjang belanja
- **Lihat Isi Keranjang**: Daftar produk yang ditambahkan dengan kuantitas dan total harga
- **Ubah Kuantitas**: Increment/decrement jumlah produk
- **Hapus Item**: Menghapus produk dari keranjang
- **Kalkulasi Total**: Perhitungan total harga keranjang
- **Persistensi Data**: Keranjang tersimpan di localStorage browser

**Catatan**: Guest tidak dapat melanjutkan ke proses checkout dan harus login/register terlebih dahulu.

## 4. Alur Sistem (Proses Kunci)

### 4.1 Alur Customer & Guest

#### 4.1.1 Alur Registrasi dan Verifikasi Email
1. Guest mengakses halaman registrasi (/auth/signup)
2. Guest mengisi form dengan email, nama, dan password
3. Sistem melakukan validasi input menggunakan Zod schema (email format, password strength)
4. Sistem memeriksa apakah email sudah terdaftar di database
5. Jika email belum terdaftar:
   - Password di-hash menggunakan bcrypt dengan salt rounds
   - Sistem generate kode OTP 6 digit random
   - Data user disimpan ke database dengan role CUSTOMER dan status isValidEmail = 0
   - Sistem mengirim email berisi kode OTP melalui Nodemailer
6. User diarahkan ke halaman verifikasi email (/auth/email-verification)
7. User memasukkan kode OTP yang diterima via email
8. Sistem memvalidasi OTP:
   - Jika cocok: update isValidEmail = 1 di database
   - Jika tidak cocok: tampilkan error message
9. Setelah verifikasi berhasil, user diarahkan ke halaman login

#### 4.1.2 Alur Login
1. User mengakses halaman login (/auth/signin)
2. User memasukkan email dan password
3. Sistem melakukan validasi input format
4. Sistem mencari user di database dengan email yang diinput dan isValidEmail = 1
5. Jika user ditemukan:
   - Sistem membandingkan password input dengan hash di database menggunakan bcrypt.compare()
   - Jika password cocok:
     - Generate Access Token JWT (expired 1 jam)
     - Generate Refresh Token JWT (expired 7 hari)
     - Return token dan data user (id, name, email, role)
6. Middleware auth.global.ts menyimpan token di Pinia store dan localStorage
7. User diarahkan ke halaman utama dengan status authenticated

#### 4.1.3 Alur Pencarian dan Filter Produk
1. Guest/Customer mengakses halaman utama (/)
2. Sistem menampilkan komponen Filters di sidebar kiri
3. User dapat melakukan:
   - **Pencarian**: Mengetik keyword di search bar
   - **Filter Kategori**: Select/unselect kategori (multiple selection)
   - **Filter Warna**: Select/unselect warna
   - **Filter Harga**: Drag slider untuk set rentang harga min-max
   - **Filter Rating**: Select rating bintang (1-5)
4. Setiap perubahan filter trigger API call ke /api/e-commerce/get-product dengan query params:
   - search: keyword pencarian
   - categories: array ID kategori
   - colors: array nama warna
   - prices: array [min, max]
   - starRating: nilai rating
   - page: halaman pagination
   - limit: jumlah item per halaman
5. Server memproses query dengan Prisma:
   - Build WHERE clause dengan AND logic untuk multiple filters
   - Filter rating dilakukan post-query dengan perhitungan receivedStars
   - Apply pagination dengan skip/take
6. Server return array produk dengan metadata pagination
7. Komponen ProductGrid render hasil dengan card layout

#### 4.1.4 Alur Melihat Detail Produk dan Review
1. User klik produk dari grid/list
2. Navigasi ke halaman /product/[slug]
3. Sistem fetch data produk melalui API /api/e-commerce/single-product:
   - Include relasi: category, images, stars, review count
4. Sistem fetch reviews melalui API /api/e-commerce/get-product-reviews:
   - Include data user (nama reviewer)
   - Include starNumber dan comment
   - Order by createdAt descending
5. Sistem menampilkan:
   - Galeri gambar produk
   - Informasi produk (nama, harga, warna, kategori)
   - Rating statistik (rata-rata bintang, jumlah review)
   - Distribusi persentase rating (berapa % dapat 5 bintang, 4 bintang, dst)
   - List review dengan nama reviewer, rating, dan komentar
6. Sistem fetch produk terkait melalui API /api/e-commerce/get-same-category-product:
   - Filter produk dengan categoryId yang sama
   - Exclude produk saat ini
   - Limit 4-6 produk
7. Tampilkan rekomendasi produk di bawah review

#### 4.1.5 Alur Menambahkan ke Keranjang Belanja
1. User klik tombol "Add to Cart" di halaman produk atau grid
2. Pinia store (useShoppingCartStore) dipanggil dengan fungsi addProductToCart()
3. Sistem check apakah produk sudah ada di keranjang:
   - Jika belum ada: tambahkan produk dengan quantity = 1 dan calculate totalProductPrice
   - Jika sudah ada: tidak ada aksi (user harus ubah quantity di cart)
4. Update shoppingCartData di store dengan spread operator
5. Calculate ulang totalPrice dengan sum semua totalProductPrice
6. Simpan data ke localStorage dengan key 'cartData'
7. Toggle showCart = true untuk menampilkan cart sidebar
8. User dapat melakukan aksi di cart:
   - **Add Quantity**: addQuantity() - increment quantity dan update totalProductPrice
   - **Reduce Quantity**: reduceQuantity() - decrement quantity, jika 0 maka remove item
   - **Remove Product**: removeProductToCart() - hapus item dari array
9. Setiap perubahan trigger ulang getTotalPrice() dan storeCartDataToLocalStorage()

#### 4.1.6 Alur Checkout dan Pembayaran (Customer Only)
1. Customer klik tombol "Checkout" di cart sidebar
2. Middleware authGuard.ts check status authentication:
   - Jika tidak login: redirect ke /auth/signin
   - Jika login: lanjut ke /checkout
3. Halaman checkout menampilkan:
   - Ringkasan order (list produk, kuantitas, subtotal)
   - Form billing/shipping (nama, email, alamat) - ambil dari data user
   - Total amount yang akan dibayar
4. Customer klik "Proceed to Payment"
5. Pinia store (useCheckoutStore) collect data:
   - userData: {id, name, email}
   - productData: array produk dari cart
   - totalPrice: total amount
6. API call POST /api/payment/create-payment dengan body data di atas
7. Server backend memproses:
   - Validasi totalPrice > 0
   - Convert amount ke cents (totalPrice * 100) untuk Xendit
   - Create Xendit customer dengan email
   - Loop productData dan insert record ke tabel payment untuk setiap produk
   - Create Xendit PaymentIntent dengan currency USD dan automatic_payment_methods
8. Server return clientSecret dari PaymentIntent
9. Frontend initialize Xendit Elements dengan clientSecret
10. Customer memasukkan detail kartu kredit di Xendit form
11. Submit payment melalui Xendit.confirmPayment()
12. Xendit memproses transaksi:
    - Jika berhasil: return payment status succeeded
    - Jika gagal: return error message
13. Setelah pembayaran berhasil:
    - Cart store dipanggil clearOutCart() untuk kosongkan keranjang
    - Hapus data dari localStorage
    - Redirect ke halaman success/konfirmasi
14. Customer dapat melihat riwayat pembayaran di halaman profile/orders

#### 4.1.7 Alur Menulis Review Produk (Customer Only)
1. Customer yang sudah login mengakses halaman detail produk
2. Di bawah informasi produk, terdapat section "Write a Review"
3. Customer klik tombol "Write Review" atau link serupa
4. Form review ditampilkan dengan:
   - Star rating selector (1-5 bintang)
   - Textarea untuk komentar
5. Customer memilih rating dan menulis komentar
6. Customer klik tombol "Submit Review"
7. Frontend validate form input (komentar tidak boleh kosong)
8. API call POST /api/e-commerce/create-review dengan body:
   - userId: dari authenticated user
   - productId: ID produk saat ini
   - starNumber: rating yang dipilih (1-5)
   - comment: teks komentar
9. Server backend memproses:
   - Validasi input dengan Zod schema (reviewSchema)
   - Check apakah user sudah pernah review produk ini:
     - Query productReview WHERE productId AND userId
     - Jika sudah ada: throw error "You already review this product"
   - Insert record baru ke tabel ProductReview
   - Update tabel productStar:
     - Check apakah productId sudah ada
     - Jika ada: increment receivedStars dengan starNumber yang baru
     - Jika belum: insert record baru dengan receivedStars = starNumber
   - Update tabel productStarPercent (untuk statistik persentase):
     - Check apakah kombinasi productId + star sudah ada
     - Jika ada: increment times (counter berapa kali rating ini diberikan)
     - Jika belum: insert record baru dengan times = 1
10. Server return success message
11. Frontend refresh review list untuk menampilkan review baru
12. Update rating statistik produk secara otomatis

### 4.2 Alur Admin

#### 4.2.1 Alur Akses Dashboard Analytics
1. Admin melakukan login dengan akun yang memiliki role ADMIN
2. Middleware authGuard.ts validate JWT token dan check role
3. Admin mengakses halaman /admin/dashboard
4. Client membuat WebSocket connection ke /api/admin/dashboard/_ws untuk real-time updates
5. API call GET /api/admin/dashboard/dashboard-data
6. Server backend eksekusi query parallel dengan Promise.all:
   - **paymentsByDate**: GROUP BY createdAt dengan SUM amount, ORDER BY createdAt ASC
   - **countPayment**: COUNT total records di tabel payment
   - **totalEarnAmount**: AGGREGATE SUM amount dari semua payment
   - **countCustomer**: COUNT users WHERE role = CUSTOMER
7. Server return data ke frontend
8. Frontend Pinia store (dashboardStore) menyimpan data
9. Komponen dashboard render:
   - Card statistic untuk total payment, total earnings, total customers
   - Line/Bar chart (Chart.js) untuk visualisasi payments by date
   - Table recent transactions
10. WebSocket listener menangkap event perubahan data:
    - Jika ada payment baru: trigger fetch ulang dashboard data
    - Update chart dan statistics secara real-time tanpa refresh halaman
11. Admin dapat melihat perubahan data secara live

#### 4.2.2 Alur Membuat Produk Baru
1. Admin mengakses halaman /admin/Products
2. Admin klik tombol "Add New Product" atau "Create Product"
3. Form create product ditampilkan dengan fields:
   - Nama Produk (text input)
   - Warna (text input atau color picker)
   - Harga (number input)
   - Kategori (dropdown select dari list kategori)
   - Gambar Produk (file upload multiple)
4. Admin mengisi semua field yang diperlukan
5. Admin upload gambar produk:
   - API call POST /api/admin/product/upload-image dengan multipart/form-data
   - Multer middleware memproses file upload
   - File disimpan di folder public/uploads/products/
   - Server return array URL gambar
6. Admin klik tombol "Submit" atau "Create Product"
7. API call POST /api/admin/product/create dengan body:
   - name: nama produk
   - color: warna produk
   - price: harga dalam decimal
   - categoryId: ID kategori yang dipilih
8. Server backend memproses:
   - Middleware withAuth() validate JWT token dan authorize admin
   - Validasi input dengan Zod schema (productSchema)
   - Generate slug dari nama produk menggunakan slugify library
   - Insert record ke tabel Product dengan data:
     - name, slug, color, price, categoryId
   - Insert records ke tabel Image untuk setiap URL gambar dengan productId
9. Server return success message dan data produk baru
10. Frontend:
    - Tampilkan success notification (Vue Toast atau SweetAlert2)
    - Refresh list produk untuk menampilkan produk baru
    - Close form modal/dialog
    - Pinia store update products array

#### 4.2.3 Alur Mengedit Produk
1. Admin mengakses halaman /admin/Products
2. Admin klik tombol "Edit" pada row produk yang ingin diubah
3. Form edit product ditampilkan, pre-filled dengan data existing:
   - Nama Produk (value dari database)
   - Warna (value dari database)
   - Harga (value dari database)
   - Kategori (selected dari database)
   - Gambar Existing (preview gambar saat ini)
4. Admin melakukan perubahan pada field yang diinginkan
5. Jika admin ingin mengganti gambar:
   - Upload gambar baru melalui /api/admin/product/upload-image
   - Gambar lama dapat dihapus atau tetap dipertahankan
6. Admin klik tombol "Update Product"
7. API call PUT/PATCH /api/admin/product/update dengan body:
   - productId: ID produk yang akan diupdate
   - name: nama produk baru (jika diubah)
   - color: warna baru (jika diubah)
   - price: harga baru (jika diubah)
   - categoryId: kategori baru (jika diubah)
   - images: array URL gambar baru (jika diubah)
8. Server backend memproses:
   - Middleware withAuth() validate authorization
   - Validasi input dengan productSchema
   - Check apakah produk dengan productId exist
   - Jika nama berubah: regenerate slug dengan slugify
   - Update record di tabel Product dengan data baru
   - Jika gambar berubah:
     - Delete records lama di tabel Image WHERE productId
     - Insert records baru dengan URL gambar baru
9. Server return success message dan data produk yang sudah diupdate
10. Frontend:
    - Tampilkan success notification
    - Refresh list produk untuk reflect perubahan
    - Close form modal
    - Update Pinia store

#### 4.2.4 Alur Menghapus Produk
1. Admin mengakses halaman /admin/Products
2. Admin klik tombol "Delete" pada row produk yang ingin dihapus
3. Confirmation dialog ditampilkan (SweetAlert2):
   - "Are you sure you want to delete this product?"
   - "This action cannot be undone"
   - Tombol "Cancel" dan "Delete"
4. Admin klik tombol "Delete" untuk konfirmasi
5. API call DELETE /api/admin/product/delete dengan params atau body:
   - productId: ID produk yang akan dihapus
6. Server backend memproses:
   - Middleware withAuth() validate authorization
   - Check apakah produk exist di database
   - Check dependencies (reviews, payments) yang terkait:
     - Jika ada data terkait: bisa throw error atau cascade delete tergantung business rule
   - Delete records terkait:
     - Images: DELETE FROM Image WHERE productId
     - ProductReviews: DELETE FROM ProductReview WHERE productId (atau soft delete)
     - ProductStars: DELETE FROM productStar WHERE productId
     - ProductStarPercent: DELETE FROM productStarPercent WHERE productId
   - Delete record produk: DELETE FROM Product WHERE id = productId
7. Server return success message
8. Frontend:
   - Tampilkan success notification "Product deleted successfully"
   - Remove item dari list produk tanpa perlu refresh
   - Update Pinia store dengan filter out produk yang dihapus

#### 4.2.5 Alur Manajemen Kategori (Create, Update, Delete)
##### Create Kategori:
1. Admin mengakses halaman /admin/categories
2. Klik tombol "Add Category"
3. Input nama kategori di form
4. API call POST /api/admin/category/create-category dengan body: {name}
5. Server validate input dan check unique constraint
6. Insert ke tabel Category
7. Return success dan refresh list kategori

##### Update Kategori:
1. Admin klik "Edit" pada kategori
2. Ubah nama kategori di form
3. API call PUT /api/admin/category/update-category dengan body: {id, name}
4. Server validate dan update record
5. Return success dan refresh list

##### Delete Kategori:
1. Admin klik "Delete" pada kategori
2. Confirmation dialog
3. Server check apakah ada produk dengan categoryId ini:
   - Jika ada: throw error "Cannot delete category with existing products"
   - Jika tidak: DELETE FROM Category WHERE id
4. Return success dan refresh list

#### 4.2.6 Alur Melihat Laporan Pembayaran
1. Admin mengakses halaman /admin/Payments
2. API call GET /api/admin/payment/all-payments
3. Server backend eksekusi query:
   - SELECT * FROM payment
   - INCLUDE relasi user (name, email) dan product (name, price)
   - ORDER BY createdAt DESC untuk tampilkan transaksi terbaru
   - Optional: pagination dengan limit/offset
4. Server return array payment records dengan data lengkap
5. Frontend render data dalam bentuk table dengan kolom:
   - Payment ID
   - Customer Name & Email
   - Product Name
   - Amount (formatted sebagai USD currency)
   - Date & Time (formatted)
   - Status (jika ada)
6. Admin dapat melakukan:
   - **Filter by Date Range**: Select tanggal mulai dan akhir
   - **Search**: Cari berdasarkan nama customer atau produk
   - **Export**: Download data dalam format CSV/Excel
7. Klik pada row untuk melihat detail transaksi lengkap:
   - Xendit payment intent ID
   - Customer billing information
   - Product details
   - Transaction timeline

#### 4.2.7 Alur Melihat Daftar Pengguna
1. Admin mengakses halaman /admin/users
2. API call GET /api/admin/user/get
3. Server backend eksekusi query:
   - SELECT * FROM User
   - ORDER BY createdAt DESC
   - Optional: filter by role (CUSTOMER/ADMIN)
   - Optional: pagination
4. Server return array user records
5. Frontend render data dalam bentuk table dengan kolom:
   - User ID
   - Name
   - Email
   - Role (ADMIN/CUSTOMER)
   - Email Verified Status (isValidEmail: Yes/No)
   - Registration Date
   - Total Orders (join dengan tabel payment)
6. Admin dapat melakukan:
   - **Search**: Cari user berdasarkan nama atau email
   - **Filter by Role**: Tampilkan hanya ADMIN atau CUSTOMER
   - **View Details**: Klik user untuk melihat detail profil dan riwayat transaksi
   - **Manage Role**: Ubah role user (dengan konfirmasi)

## 5. Kebutuhan Fungsional

**FR-01**: Sistem harus menyediakan fitur registrasi pengguna dengan validasi email menggunakan kode OTP 6 digit yang dikirim melalui email.

**FR-02**: Sistem harus mengimplementasikan autentikasi berbasis JWT dengan Access Token (expired 1 jam) dan Refresh Token (expired 7 hari).

**FR-03**: Sistem harus mengenkripsi password pengguna menggunakan bcrypt dengan salt rounds sebelum menyimpan ke database.

**FR-04**: Sistem harus menyediakan fitur katalog produk dengan pagination (10 item per halaman) dan mendukung pencarian berdasarkan nama produk (case-insensitive).

**FR-05**: Sistem harus menyediakan filter multi-kriteria untuk produk berdasarkan kategori (multiple selection), warna (multiple selection), rentang harga (minimum-maksimum), dan rating bintang (1-5).

**FR-06**: Sistem harus menampilkan detail produk lengkap termasuk nama, slug, warna, harga, kategori, multiple gambar, rating rata-rata, jumlah review, dan distribusi persentase rating.

**FR-07**: Sistem harus menyediakan fitur keranjang belanja dengan kemampuan menambah/mengurangi kuantitas, menghapus item, dan perhitungan total harga otomatis, dengan persistensi data di localStorage browser.

**FR-08**: Sistem harus mengintegrasikan payment gateway Xendit untuk memproses pembayaran dengan kartu kredit/debit, termasuk pembuatan PaymentIntent dan customer object.

**FR-09**: Sistem harus menyimpan record transaksi pembayaran ke database untuk setiap produk dalam keranjang dengan informasi userId, productId, amount, dan timestamp.

**FR-10**: Sistem harus memungkinkan customer terautentikasi untuk menulis review produk dengan rating bintang (1-5) dan komentar, dengan pembatasan satu review per user per produk.

**FR-11**: Sistem harus secara otomatis menghitung dan memperbarui statistik rating produk (total received stars dan persentase distribusi rating) setiap kali review baru ditambahkan.

**FR-12**: Sistem harus menyediakan dashboard analytics untuk admin dengan data real-time meliputi total pembayaran, total pendapatan, jumlah customer, dan grafik pembayaran berdasarkan tanggal.

**FR-13**: Sistem harus memungkinkan admin untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada produk dengan validasi input dan generasi slug otomatis dari nama produk.

**FR-14**: Sistem harus menyediakan fitur upload multiple gambar produk melalui Multer middleware dengan penyimpanan di folder public/uploads/products/.

**FR-15**: Sistem harus memungkinkan admin untuk melakukan operasi CRUD pada kategori dengan validasi unique constraint pada nama kategori.

**FR-16**: Sistem harus mencegah penghapusan kategori yang masih memiliki produk terkait dengan error message yang jelas.

**FR-17**: Sistem harus menyediakan halaman laporan pembayaran untuk admin yang menampilkan seluruh transaksi dengan informasi customer, produk, amount, dan timestamp, dengan kemampuan filter dan search.

**FR-18**: Sistem harus menampilkan daftar seluruh pengguna terdaftar kepada admin dengan informasi lengkap termasuk role, status verifikasi email, dan tanggal registrasi.

**FR-19**: Sistem harus menampilkan rekomendasi produk terkait berdasarkan kategori yang sama pada halaman detail produk, dengan limit 4-6 produk dan exclude produk saat ini.

**FR-20**: Sistem harus mengimplementasikan middleware authGuard untuk proteksi API endpoints admin, dengan validasi JWT token dan pengecekan role ADMIN.

## 6. Kebutuhan Non Fungsional

**NFR-01 (Keamanan)**: Sistem harus menggunakan HTTPS untuk semua komunikasi antara client dan server, mengenkripsi password dengan bcrypt (minimum 10 salt rounds), dan menyimpan JWT secret key di environment variables yang tidak ter-commit ke repository.

**NFR-02 (Keamanan)**: Sistem harus mengimplementasikan validasi input menggunakan Zod schema untuk semua endpoint API guna mencegah injection attacks (SQL injection, XSS), dengan sanitasi dan escaping data yang diterima dari client.

**NFR-03 (Keamanan)**: Sistem harus memvalidasi dan membatasi ukuran file upload maksimal 5MB per gambar, dengan whitelist ekstensi file yang diperbolehkan (jpg, jpeg, png, webp) untuk mencegah upload file berbahaya.

**NFR-04 (Kinerja)**: Halaman katalog produk harus load dalam waktu maksimal 2 detik dengan koneksi normal (3G/4G), menggunakan pagination untuk membatasi jumlah data yang di-fetch (10 item per request).

**NFR-05 (Kinerja)**: Sistem harus menggunakan database indexing pada kolom yang sering di-query (email, slug, categoryId) untuk mempercepat pencarian dan filter produk.

**NFR-06 (Kinerja)**: Sistem harus menggunakan Promise.all untuk eksekusi parallel pada multiple database queries (seperti di dashboard analytics) untuk mengurangi waktu response.

**NFR-07 (Skalabilitas)**: Sistem harus menggunakan connection pooling pada Prisma Client untuk mengelola koneksi database secara efisien dan mencegah exhaustion pada concurrent requests.

**NFR-08 (Usability)**: User interface harus responsive dan mobile-friendly, menggunakan Tailwind CSS untuk konsistensi styling, dengan breakpoints untuk mobile (< 768px), tablet (768px - 1024px), dan desktop (> 1024px).

**NFR-09 (Usability)**: Sistem harus menampilkan feedback visual yang jelas untuk setiap aksi user (loading indicators, success notifications, error messages) menggunakan Vue Toast Notification atau SweetAlert2.

**NFR-10 (Usability)**: Form input harus memiliki validasi real-time dengan error messages yang informatif, menampilkan field-specific errors di bawah setiap input field yang bermasalah.

**NFR-11 (Reliabilitas)**: Sistem harus menghandle error dengan gracefully, tidak crash application, dan menampilkan user-friendly error messages ketika terjadi kegagalan API call atau network issues.

**NFR-12 (Reliabilitas)**: Sistem pembayaran harus mengimplementasikan transaction handling untuk memastikan atomicity - jika pembayaran gagal, tidak ada record payment yang tersimpan di database.

**NFR-13 (Maintainability)**: Kode harus terorganisir dengan modular structure, memisahkan business logic ke folder modules, dan menggunakan TypeScript untuk type safety dan better code documentation.

**NFR-14 (Maintainability)**: Sistem harus menggunakan environment variables untuk konfigurasi sensitive (database URL, JWT secrets, Xendit keys, SMTP credentials) yang disimpan di file .env dan tidak di-commit ke git.

**NFR-15 (Observability)**: Sistem harus mengimplementasikan logging untuk critical operations (login attempts, payment transactions, data modifications) dengan timestamp dan user identification.

**NFR-16 (Compliance)**: Sistem harus mematuhi standar PCI DSS untuk handling data kartu kredit dengan tidak menyimpan credit card details di database, delegating semua payment processing ke Xendit.

**NFR-17 (Availability)**: Sistem harus memiliki uptime minimal 99% dengan implementasi error boundaries dan fallback UI ketika terjadi component failures.

**NFR-18 (Interoperability)**: Sistem harus kompatibel dengan browser modern (Chrome, Firefox, Safari, Edge versi 2 tahun terakhir) dan mendukung ES6+ JavaScript features.

## 7. Output Sistem

### 7.1 Dashboard Analytics Report
Output berupa halaman dashboard yang menampilkan visualisasi data analytics secara real-time dengan komponen:
- **Card Metrics**: Total Pembayaran, Total Pendapatan (USD), Jumlah Customer
- **Grafik Pendapatan**: Line chart atau bar chart yang menampilkan trend pembayaran berdasarkan tanggal pembuatan, divisualisasi menggunakan Chart.js
- **Recent Transactions Table**: Tabel 10 transaksi terakhir dengan kolom: Payment ID, Customer, Product, Amount, Date
- **WebSocket Updates**: Data ter-update secara otomatis tanpa refresh halaman ketika ada transaksi baru

### 7.2 Laporan Transaksi Pembayaran
Output berupa tabel komprehensif yang dapat difilter dan di-export dengan informasi:
- **Kolom Data**: Payment ID, Customer Name, Customer Email, Product Name, Amount (USD currency format), Transaction Date & Time, Status
- **Fitur Filter**: Filter berdasarkan date range (start date - end date), status pembayaran
- **Fitur Search**: Pencarian berdasarkan nama customer atau nama produk
- **Export Capability**: Download data dalam format CSV atau Excel untuk analisis lebih lanjut
- **Pagination**: Navigasi untuk large datasets dengan 20 records per halaman

### 7.3 Daftar Produk (Product Catalog)
Output berupa grid atau list produk dengan format:
- **Card Layout**: Setiap produk ditampilkan dalam card dengan gambar thumbnail, nama produk, harga (USD format), rating bintang rata-rata, jumlah review
- **Badge Indicators**: Label untuk produk baru, best seller, atau discount (jika ada)
- **Quick Actions**: Tombol "View Details" dan "Add to Cart" accessible dari card
- **Responsive Grid**: 4 kolom untuk desktop, 2 kolom untuk tablet, 1 kolom untuk mobile
- **Pagination Controls**: Tombol Previous/Next dan indicator halaman saat ini

### 7.4 Detail Produk dan Review
Output berupa halaman detail lengkap dengan sections:
- **Product Gallery**: Carousel atau grid untuk multiple gambar produk dengan zoom capability
- **Product Information Panel**: Nama, harga, warna, kategori, deskripsi, availability status
- **Rating Summary**: 
  - Rata-rata rating dalam format bintang dan angka (misal: 4.5/5)
  - Total jumlah review
  - Bar chart distribusi rating (berapa % untuk 5 bintang, 4 bintang, 3 bintang, dst)
- **Review Section**: 
  - List review dengan nama reviewer, rating bintang, komentar, dan timestamp
  - Sort options (Most Recent, Highest Rating, Lowest Rating)
  - Pagination untuk review jika > 10 review
- **Related Products**: Grid 4-6 produk dengan kategori yang sama

### 7.5 Invoice Pembayaran (Email Confirmation)
Output berupa email notifikasi yang dikirim ke customer setelah pembayaran berhasil dengan konten:
- **Header**: Logo aplikasi, judul "Payment Confirmation"
- **Order Summary**: 
  - Order ID/Payment ID unik
  - Transaction date and time
  - Tabel produk yang dibeli (nama, kuantitas, harga per unit, subtotal)
  - Total amount paid (USD)
- **Customer Information**: Nama, email, billing address (jika ada)
- **Payment Method**: Last 4 digits kartu kredit yang digunakan
- **Footer**: Contact information, link ke customer support, social media links

### 7.6 Keranjang Belanja (Shopping Cart)
Output berupa sidebar atau modal yang menampilkan:
- **Cart Items List**: 
  - Thumbnail gambar produk
  - Nama produk dengan link ke detail page
  - Harga per unit
  - Quantity selector (+ / - buttons)
  - Subtotal per item
  - Tombol remove item (X atau trash icon)
- **Cart Summary**: 
  - Subtotal (sum semua item)
  - Tax/shipping (jika applicable)
  - Grand total (bold, larger font)
- **Action Buttons**: "Continue Shopping" dan "Proceed to Checkout" (disabled jika cart empty)
- **Empty State**: Pesan "Your cart is empty" dengan CTA "Start Shopping" jika tidak ada item

### 7.7 Email Verifikasi OTP
Output berupa email yang dikirim ke user setelah registrasi dengan konten:
- **Subject**: "Verify Your Email - E-Commerce App"
- **Body**: 
  - Greeting dengan nama user
  - Penjelasan singkat tentang verifikasi email
  - Kode OTP 6 digit dalam format besar dan jelas (misal: styled dengan background dan border)
  - Instruksi untuk memasukkan kode di halaman verifikasi
  - Link langsung ke halaman verifikasi (dengan query param pre-filled email)
  - Disclaimer: "Kode ini valid untuk 10 menit"
  - Warning: "Jika Anda tidak melakukan registrasi, abaikan email ini"
- **Footer**: Brand logo, contact information

### 7.8 Notifikasi Sistem (Toast/Alert)
Output berupa pop-up notifications untuk berbagai aksi dengan variasi:
- **Success Notification** (hijau): 
  - "Product added to cart successfully"
  - "Payment processed successfully"
  - "Review submitted successfully"
  - "Product created/updated/deleted successfully"
- **Error Notification** (merah): 
  - "Invalid email or password"
  - "Payment failed. Please try again"
  - "You already reviewed this product"
  - "Cannot delete category with existing products"
- **Warning Notification** (kuning): 
  - "Please verify your email to continue"
  - "Session expired. Please login again"
- **Info Notification** (biru): 
  - "OTP code sent to your email"
  - "Cart updated"
- **Format**: Auto-dismiss after 3-5 seconds, positioned top-right atau top-center, dengan icon yang sesuai (checkmark, X, warning triangle, info circle)

### 7.9 Laporan Daftar Pengguna
Output berupa tabel users untuk admin dengan format:
- **Kolom Data**: User ID, Name, Email, Role (badge dengan warna berbeda untuk ADMIN/CUSTOMER), Email Verified Status (icon checkmark atau X), Registration Date, Total Orders (count payment)
- **Fitur Filter**: Filter by role (All/Admin/Customer), filter by email verified status
- **Fitur Search**: Search bar untuk cari berdasarkan nama atau email
- **Action Buttons**: View Details (redirect ke profile page), Edit Role (dengan confirmation modal), Delete User (dengan confirmation dan cascade warning)
- **Pagination**: 20 users per halaman dengan navigation controls
- **Export**: Download user list dalam format CSV untuk reporting purposes

### 7.10 Product Management Interface (Admin)
Output berupa halaman CRUD produk dengan komponen:
- **Product Table/Grid**: 
  - Thumbnail gambar produk
  - Nama produk (clickable untuk preview)
  - Kategori (badge)
  - Warna (color indicator dot)
  - Harga (USD format)
  - Stock status (jika ada inventory tracking)
  - Action buttons: Edit (pencil icon), Delete (trash icon)
- **Create/Edit Form Modal**: 
  - Input fields: Name, Color, Price, Category (dropdown)
  - Image upload area dengan drag-and-drop dan preview
  - Generated slug preview (auto dari nama)
  - Validation errors display
  - Submit dan Cancel buttons
- **Delete Confirmation Dialog**: 
  - Warning message
  - Informasi tentang dependencies (jumlah review, orders yang terkait)
  - Confirm dan Cancel buttons dengan color coding (red untuk confirm delete)
- **Bulk Actions**: Checkbox untuk select multiple products, bulk delete option
