# 🔐 Environment Variables Setup for Vercel Deployment

## ⚠️ IMPORTANT Security Notes

1. **NEVER commit `.env.local` to Git** - It contains secrets
2. **Generate NEW secrets for production** - Don't reuse development secrets
3. **Update URLs after first deployment** - Replace localhost with your Vercel domain

---

## 📝 Step-by-Step Setup

### Step 1: Generate Production Secrets

Run these commands to generate secure secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

Copy the outputs - you'll need them in Step 3.

---

### Step 2: Prepare Your MongoDB Connection String

**From MongoDB Atlas:**

1. Go to MongoDB Atlas Dashboard
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password

**Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

**⚠️ Special Characters in Password?**

If your password contains special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

---

### Step 3: Add Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables (one by one):

#### 🗄️ Database

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority` | Production, Preview, Development |

#### 🔐 Authentication & Security

| Variable | Value | Environment |
|----------|-------|-------------|
| `JWT_SECRET` | (output from `openssl rand -base64 32`) | Production, Preview, Development |
| `NEXTAUTH_SECRET` | (output from `openssl rand -base64 32`) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | Production |
| `NEXTAUTH_URL` | Use preview URL | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |

#### 🌐 Application URLs

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | Use preview URL | Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

#### ☁️ Cloudinary (Image Upload)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your cloud name | All |
| `CLOUDINARY_API_KEY` | Your API key | All |
| `CLOUDINARY_API_SECRET` | Your API secret | All |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your upload preset | All |

#### 💳 Payment (Optional - if using Stripe)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your publishable key | All |
| `STRIPE_SECRET_KEY` | Your secret key | All |

#### ⚙️ System

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |

---

### Step 4: First Deployment

1. **Deploy without correct URLs** (first time):
   ```bash
   git push
   # or
   vercel deploy --prod
   ```

2. **Vercel assigns you a URL** like:
   ```
   https://my-next-app-abc123.vercel.app
   ```

3. **Update these variables in Vercel:**
   - `NEXTAUTH_URL` → `https://my-next-app-abc123.vercel.app`
   - `NEXT_PUBLIC_APP_URL` → `https://my-next-app-abc123.vercel.app`

4. **Redeploy:**
   ```bash
   # Trigger redeploy in Vercel dashboard
   # Or push another commit
   git commit --allow-empty -m "Update environment variables"
   git push
   ```

---

## 🔍 Verification Checklist

After deployment, verify these:

- [ ] Can visit your deployed URL
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Session persists after page refresh
- [ ] Can browse products
- [ ] Images load correctly
- [ ] Can add items to cart
- [ ] Can complete checkout
- [ ] Can view orders

---

## 🚨 Troubleshooting

### Issue: "MONGODB_URI is not defined"

**Solution:** 
- Check environment variable is added in Vercel
- Ensure it's enabled for Production environment
- Redeploy after adding

### Issue: "Invalid token" after login

**Solution:**
- Ensure `JWT_SECRET` is set in Vercel
- Clear browser cookies
- Try login again

### Issue: Authentication not persisting

**Solution:**
- Verify `NEXTAUTH_URL` matches your deployed URL exactly
- Check cookies are enabled in browser
- Ensure no trailing slash in URL

### Issue: Images not loading

**Solution:**
- Verify all Cloudinary variables are set
- Check Cloudinary upload preset exists and is "unsigned"
- Verify image domains in `next.config.mjs`

### Issue: "Network Access" error from MongoDB

**Solution:**
- Go to MongoDB Atlas → Network Access
- Add IP Address: `0.0.0.0/0` (Allow from anywhere)
- This is required for Vercel serverless functions

---

## 📋 Quick Copy Template

Use this as a checklist when adding to Vercel:

```bash
# Required for ALL environments
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_generated_jwt_secret_here
NEXTAUTH_SECRET=your_generated_nextauth_secret_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Production ONLY (update after first deploy)
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
NEXT_PUBLIC_APP_URL=https://your-actual-vercel-url.vercel.app
NODE_ENV=production
```

---

## 🔒 Security Best Practices

✅ **DO:**
- Generate new secrets for production
- Use strong, random secrets (32+ characters)
- Set different secrets for development/production
- Keep `.env.local` in `.gitignore`
- Use Vercel's environment variables (encrypted at rest)

❌ **DON'T:**
- Commit `.env.local` to Git
- Share secrets in public repositories
- Reuse the same secrets across projects
- Use weak or predictable secrets
- Expose secrets in client-side code

---

## 📞 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Review MongoDB Atlas logs
3. Check browser console for errors
4. Verify all environment variables are set
5. Ensure MongoDB Network Access allows Vercel IPs

---

**Your environment is now ready for production deployment! 🚀**
