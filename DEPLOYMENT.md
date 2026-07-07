# 🚀 Vercel Deployment Guide - Next.js E-commerce Platform

## 📋 Pre-Deployment Checklist

Before deploying to Vercel, ensure you have:

- [ ] MongoDB Atlas database configured and accessible
- [ ] Cloudinary account set up (for image uploads)
- [ ] All environment variables ready
- [ ] GitHub repository created (optional but recommended)

---

## 🔐 Step 1: Set Up Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add the following:

### **Required Variables**

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Authentication & Security
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-jwt-secret-here

# Application URL
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Cloudinary (Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Environment
NODE_ENV=production
```

### **Optional Variables (Payment Gateway)**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🔑 Step 2: Generate Secrets

Generate secure secrets for JWT and NextAuth:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

Copy the outputs and use them as your secrets in Vercel.

---

## 🌐 Step 3: Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL

After your first deployment, Vercel will give you a URL like:
`https://your-app-name.vercel.app`

**Update these environment variables in Vercel:**
- `NEXTAUTH_URL=https://your-app-name.vercel.app`
- `NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app`

Then **redeploy** your application.

---

## 📦 Step 4: MongoDB Atlas Setup

### Whitelist Vercel IP Addresses

In MongoDB Atlas:
1. Go to **Network Access**
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ This is required for Vercel serverless functions
   - Your connection is still secure via username/password

### Connection String Format

```bash
mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
```

Replace:
- `<username>` - Your MongoDB username
- `<password>` - Your MongoDB password (URL-encoded if it contains special characters)
- `<dbname>` - Your database name (e.g., `ecommerce`)

---

## ☁️ Step 5: Cloudinary Setup

### Create Unsigned Upload Preset

1. Go to **Cloudinary Dashboard** → **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set **Signing Mode** to **Unsigned**
5. Set **Folder** to `ecommerce_products` (or your preferred folder)
6. Copy the preset name

Use this preset name as `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## 🚀 Step 6: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your Git repository
4. Vercel auto-detects Next.js configuration
5. Add all environment variables (from Step 1)
6. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow prompts and deploy to production
vercel --prod
```

---

## ✅ Step 7: Post-Deployment Verification

### Test Authentication
1. Register a new user
2. Login
3. Verify token persistence across page refreshes

### Test Admin Features
1. Register an admin user (in development first)
2. Login as admin
3. Test product creation, editing, deletion
4. Test order management

### Test Customer Features
1. Browse products
2. Add items to cart
3. Create an order
4. View order history

### Test Image Uploads
1. Go to Admin → Products → Create Product
2. Upload product images
3. Verify images appear correctly

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "MONGODB_URI is not defined"
**Solution:** Add `MONGODB_URI` to Vercel environment variables and redeploy

### Issue 2: "Invalid token" after deployment
**Solution:** Ensure `JWT_SECRET` in Vercel matches what was used to generate tokens

### Issue 3: Images not loading
**Solution:** 
- Verify `next.config.mjs` includes all image domains
- Check Cloudinary environment variables
- Ensure unsigned upload preset is created

### Issue 4: "Cannot connect to MongoDB"
**Solution:**
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify connection string is correct
- Check username/password don't have special characters (or URL-encode them)

### Issue 5: "NEXTAUTH_URL is not defined"
**Solution:** 
- Add `NEXTAUTH_URL` to Vercel environment variables
- Set it to your deployed URL (e.g., `https://your-app.vercel.app`)
- Redeploy

---

## 🔄 Updating Environment Variables

After changing environment variables in Vercel:
1. Go to **Deployments** tab
2. Click **...** menu on latest deployment
3. Click **Redeploy**

Or trigger a new deployment via Git push.

---

## 📊 Monitoring

### View Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on a deployment → **Functions** tab
- View real-time logs

### Database Monitoring
- MongoDB Atlas → Clusters → Metrics
- Monitor connection count, operations, data size

---

## 🔒 Security Best Practices

1. **Never commit `.env.local` to Git**
2. **Use strong JWT secrets** (32+ characters)
3. **Rotate secrets periodically**
4. **Monitor Vercel logs** for suspicious activity
5. **Keep dependencies updated** (`npm audit`)

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review this deployment guide
4. Verify all environment variables are set correctly

---

## 🎉 Success!

Your Next.js E-commerce platform is now live on Vercel!

**Next Steps:**
- Set up a custom domain (optional)
- Configure analytics (Vercel Analytics)
- Set up monitoring (Sentry, LogRocket, etc.)
- Configure email notifications
- Add payment gateway integration
- Set up CI/CD pipeline
