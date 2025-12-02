# RAIH E-Commerce - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 5.7+ or 8.0+
- npm or yarn

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE raih_ecommerce;
exit;
```

3. **Configure Environment**
- Copy `.env.example` to `.env`
- Update database credentials in `.env`
- Set JWT secret keys (generate random strings)
- Configure email service (Mailtrap for testing)

4. **Setup Prisma**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

5. **Run Development Server**
```bash
npm run dev
```

Visit: http://localhost:3000

## 🔑 Default Credentials

### Create Admin User
1. Register a new account
2. Verify email with OTP
3. Manually update role in database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 📱 Key Features

### Customer Features
- ✅ Product browsing with filters
- ✅ Shopping cart management
- ✅ Secure checkout with Xendit
- ✅ Product reviews and ratings
- ✅ Order history

### Admin Features
- ✅ Dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Category management
- ✅ User management
- ✅ Payment tracking

## 🧪 Testing

### Test User Flow
1. **Register**: Go to `/auth/signup`
2. **Verify Email**: Enter OTP from email
3. **Browse Products**: Homepage with filters
4. **Add to Cart**: Click "Add to Cart"
5. **Checkout**: Click cart icon, then "Checkout"
6. **Payment**: Complete payment form

### Test Admin Flow
1. **Login as Admin**: `/auth/signin`
2. **Access Dashboard**: `/admin/dashboard`
3. **Manage Products**: `/admin/products`
4. **View Analytics**: Check dashboard charts

## 📦 Build for Production

```bash
# Build application
npm run build

# Preview production build
npm run preview

# Start production server
npm start
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

**Email Not Sending**
- Configure SMTP settings in `.env`
- Use Mailtrap for testing
- Check firewall settings

**Prisma Errors**
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

**Port Already in Use**
```bash
# Change port in package.json or
PORT=3001 npm run dev
```

## 📚 Project Structure

```
raih/
├── server/           # Backend API
│   ├── api/         # API endpoints
│   └── utils/       # Utilities
├── pages/           # Frontend pages
├── components/      # Vue components
├── stores/          # Pinia stores
├── layouts/         # App layouts
├── middleware/      # Route middleware
├── prisma/          # Database schema
├── public/          # Static assets
└── docs/            # Documentation
```

## 🌐 API Documentation

### Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

### Key Endpoints
- Auth: `/auth/login`, `/auth/register`
- Products: `/e-commerce/get-products`
- Admin: `/admin/*` (requires auth)

## 🛡️ Security Notes

- Always use HTTPS in production
- Keep JWT secrets secure
- Regularly update dependencies
- Enable CORS for production domain
- Use environment variables for sensitive data

## 📧 Support

For issues or questions:
1. Check `/docs` folder for detailed documentation
2. Review `qa_checklist.md` for testing
3. Check error logs in console

## 🎉 Ready to Go!

Your RAIH E-Commerce platform is now ready. Start by creating some categories and products in the admin panel, then test the shopping experience!

---

**Version**: 1.0.0
**Last Updated**: December 2024
