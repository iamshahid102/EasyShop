# 🛍️ Next.js 15 E-commerce Platform

A production-ready, full-stack e-commerce platform built with Next.js 15 (App Router), MongoDB, and deployed on Vercel.

## ✅ Production Status

**This application is 100% production-ready and fully audited for Vercel deployment.**

All critical issues identified and resolved. See [PRODUCTION-AUDIT-REPORT.md](./PRODUCTION-AUDIT-REPORT.md) for complete details.

---

## ✨ Features

### Customer Features
- 🔐 User authentication (register, login, logout)
- 📦 Browse products with search and filters
- 🛒 Shopping cart management
- 💳 Checkout and order placement
- 📋 Order history and tracking
- ⭐ Product ratings and reviews

### Admin Features
- 📊 Admin dashboard with analytics
- ➕ Create, edit, and delete products
- 📸 Image upload via Cloudinary
- 📦 Order management (status updates)
- 👥 User management
- 🔍 Advanced search and filtering

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Local Development

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your credentials (see `.env.example` for all variables).

3. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

📖 **Complete Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy Steps

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables from `.env.example`
4. Deploy
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel domain
6. Redeploy

### Pre-Deployment Checklist

Follow [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md) before deploying to ensure everything is configured correctly.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Node.js (Serverless), MongoDB, Mongoose
- **Authentication:** JWT + bcryptjs
- **Image Storage:** Cloudinary
- **Hosting:** Vercel

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with step-by-step instructions
- **[PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)** - Pre-deployment verification checklist
- **[PRODUCTION-AUDIT-REPORT.md](./PRODUCTION-AUDIT-REPORT.md)** - Complete audit results and fixes

---

## 🔒 Security & Performance

✅ JWT authentication with secure cookies  
✅ Security headers (HSTS, X-Frame-Options, etc.)  
✅ Password hashing with bcrypt  
✅ Database connection pooling  
✅ 27 optimized database indexes  
✅ Next.js Image optimization  
✅ Global error boundaries  

---

## 📦 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
```

---

## 🐛 Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues and solutions.

---

**Built with ❤️ using Next.js 15**
