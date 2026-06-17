# Hosting Backend on Render - Complete Guide

## Overview

This guide walks you through deploying your Node.js backend to Render after pushing code to GitHub.

---

## STEP 1: Push Code to GitHub

### 1.1 Initialize Git (if not done)

```bash
cd c:\Users\asus\OneDrive\Desktop\ecommerce
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecommerce.git
git push -u origin main
```

### 1.2 Or Push Existing Code

```bash
cd c:\Users\asus\OneDrive\Desktop\ecommerce
git add .
git commit -m "Backend ready for Render deployment"
git push origin main
```

**Verify**: Go to your GitHub repo and see all files pushed including `backend/` folder

---

## STEP 2: Create Render Account

1. Go to **[render.com](https://render.com)**
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your GitHub repos
5. Complete your profile

---

## STEP 3: Create Web Service on Render

### 3.1 Start New Service

1. In Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"** from dropdown

### 3.2 Connect GitHub Repository

1. Click **"Connect account"** under "Public Git Repository"
2. A list of your GitHub repos appears
3. Find and click **your ecommerce repository**
4. Click **"Connect"**

### 3.3 Configure Service Settings

Fill in the form with these values:

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Name**          | `ecommerce-backend`                            |
| **Environment**   | `Node`                                         |
| **Region**        | Select closest to your users (default: Oregon) |
| **Branch**        | `main`                                         |
| **Build Command** | `npm install`                                  |
| **Start Command** | `npm start`                                    |
| **Instance Type** | `Free`                                         |

### 3.4 Service Details Example

```
Name: ecommerce-backend
Environment: Node
Region: Singapore (or Oregon/US-East)
Branch: main
Build Command: npm install
Start Command: npm start
Instance: Free (or Starter+)
```

---

## STEP 4: Add Environment Variables

### 4.1 Navigate to Environment Section

After clicking **"Create Web Service"**, you'll see the service page.
On the left sidebar, click **"Environment"** tab.

### 4.2 Add Each Environment Variable

Click **"Add Environment Variable"** for each of these:

**Variable 1: PORT**

- Key: `PORT`
- Value: `8000`

**Variable 2: Database URL**

- Key: `DB_URL`
- Value:

```
mongodb://asadkhan997759_db_user:W9NNiSMJvZzy57qF@ac-uy0dlgb-shard-00-00.g4ldfss.mongodb.net:27017,ac-uy0dlgb-shard-00-01.g4ldfss.mongodb.net:27017,ac-uy0dlgb-shard-00-02.g4ldfss.mongodb.net:27017/?ssl=true&replicaSet=atlas-10qcmm-shard-0&authSource=admin&appName=Cluster0
```

**Variable 3: JWT Secret**

- Key: `JWT_SECRET`
- Value: `generate-a-random-strong-secret-here-at-least-32-characters`
  - Generate: `openssl rand -base64 32` (or use any random string)

**Variable 4: Google OAuth Client ID**

- Key: `GOOGLE_CLIENT_ID`
- Value: `your-google-client-id.apps.googleusercontent.com`

**Variable 5: Google OAuth Secret**

- Key: `GOOGLE_CLIENT_SECRET`
- Value: `your-google-client-secret`

**Variable 6: Cloudinary Name**

- Key: `CLOUDINARY_NAME`
- Value: `dl3tcwp5s`

**Variable 7: Cloudinary API Key**

- Key: `CLOUDINARY_API_KEY`
- Value: `111665297538111`

**Variable 8: Cloudinary API Secret**

- Key: `CLOUDINARY_API_SECRET`
- Value: `SXG5R_ShD9mv2w-Y_lwrifbr2u8`

### 4.3 Verify All Variables Added

Make sure all 8 variables appear in the Environment section before proceeding.

---

## STEP 5: Deploy Backend

### 5.1 Trigger Deployment

After adding environment variables, you'll be back at the service page.

1. Click **"Create Web Service"** button (bottom right)
2. Or if that's not visible, Render may auto-start building
3. Watch the **"Build"** tab for deployment progress

### 5.2 Monitor Deployment

- You'll see logs like:

  ```
  $ npm install
  added 85 packages in 30s

  $ npm start
  [INFO] Server is running on port 8000
  ```

- Deployment typically takes **2-5 minutes**
- When complete, you'll see: **✓ Live** status

### 5.3 Get Your URL

Once deployment is complete:

1. Look at the top of the service page
2. You'll see a URL like: **`https://ecommerce-backend.onrender.com`**
3. Copy this URL - you'll need it for the frontend

---

## STEP 6: Verify Backend is Working

### 6.1 Test in Browser

1. Open a new browser tab
2. Visit: `https://ecommerce-backend.onrender.com/`
3. You should see: **"E-commerce API Server"**

### 6.2 Test API Endpoints

Try these URLs (replace domain with your Render URL):

**Test Menu API:**

```
https://ecommerce-backend.onrender.com/api/menu
```

Expected: JSON array of menu items (or empty array if no data)

**Test Products API:**

```
https://ecommerce-backend.onrender.com/api/products
```

Expected: JSON array of products

**Test Collections:**

```
https://ecommerce-backend.onrender.com/api/collections/shop
```

Expected: Products in "shop" collection (if exists)

### 6.3 If Tests Fail

- Check the **"Logs"** tab on Render for errors
- Verify all environment variables are set correctly
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

---

## STEP 7: MongoDB IP Whitelist Setup

To allow Render to connect to your MongoDB:

### 7.1 Access MongoDB Atlas

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Log into your MongoDB Atlas account
3. Click on your cluster

### 7.2 Add IP to Whitelist

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Enter: `0.0.0.0/0` (allows all IPs)
4. Or enter Render's specific IP if known
5. Click **"Confirm"**

**Note**: `0.0.0.0/0` allows any IP to connect. For production, restrict to your Render IP.

---

## STEP 8: Update Frontend to Use Render Backend

### 8.1 Update API Base URL

Edit `frontend/src/utils/api.ts`:

```typescript
// OLD (local development):
const API_BASE_URL = "http://localhost:8000";

// NEW (Render production):
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://ecommerce-backend.onrender.com";
```

### 8.2 Update Frontend Environment

Edit `frontend/.env.local`:

```env
VITE_API_URL=https://ecommerce-backend.onrender.com
```

### 8.3 Search & Replace All References

Find all instances of `localhost:8000` in frontend code and replace with your Render URL:

```bash
# In your project directory:
grep -r "localhost:8000" frontend/
```

Replace all with: `https://ecommerce-backend.onrender.com`

---

## STEP 9: Test Frontend with Deployed Backend

1. Run frontend locally:

   ```bash
   cd frontend
   npm run dev
   ```

2. Test these operations:
   - ✅ Login with Google
   - ✅ View products
   - ✅ Add to cart
   - ✅ Visit collection pages
   - ✅ Admin menu/product management

3. Open browser console (F12) to check for errors
4. If API calls fail, verify Render URL is correct

---

## Important: Security Setup

### 9.1 Keep Secrets Safe

- ⚠️ **NEVER** commit `.env` file to GitHub
- ✅ `.env` should be in `.gitignore`
- ✅ Environment variables go only on Render dashboard

Check `.gitignore`:

```
# Should contain:
backend/.env
frontend/.env.local
```

### 9.2 Change JWT Secret

The current JWT_SECRET is generic. For production:

1. Generate a strong random secret:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the output
3. On Render dashboard → Environment → Update `JWT_SECRET`
4. Service auto-restarts

### 9.3 Restrict CORS (Optional, for Production)

In `backend/app.js`, change:

```javascript
// Current (allows all):
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// Production (restrict to frontend domain):
app.use(
  cors({
    origin: "https://your-frontend-domain.com",
    credentials: true,
  }),
);
```

---

## Monitoring & Maintenance

### 10.1 View Logs

- Render dashboard → Your service → **"Logs"** tab
- See real-time server output
- Useful for debugging

### 10.2 Restart Service

- Render dashboard → Your service → **"Restart"** button
- Restarts server without redeploying
- Useful if something freezes

### 10.3 Update Code

When you make changes to backend:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render automatically rebuilds and deploys!

### 10.4 Update Environment Variables

1. Render dashboard → Service → **"Environment"**
2. Click on variable to edit
3. Change value
4. Click **"Update"**
5. Service auto-restarts with new value

---

## Troubleshooting

### Issue: 502 Bad Gateway

**Solution**:

- Check Render Logs for errors
- Verify environment variables all set
- Restart service
- Check if DB connection works

### Issue: "Cannot connect to database"

**Solution**:

- Verify DB_URL is correct
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Ensure MongoDB password doesn't have special characters (or URL encode them)

### Issue: API returns 404

**Solution**:

- Verify routes exist in backend
- Check if backend build succeeded (see Logs)
- Ensure Start Command is correct

### Issue: Service keeps restarting

**Solution**:

- Check Logs for JavaScript errors
- Verify environment variables format
- Test locally with same env vars

### Issue: Cloudinary upload fails

**Solution**:

- Verify CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Restart service after updating variables
- Check Cloudinary dashboard for upload restrictions

### Issue: Google OAuth returns 400 error

**Solution**:

- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check Google Cloud Console for OAuth configuration
- Add Render domain to authorized origins

---

## Free Tier Limitations

### What's Included

- ✅ Free to use
- ✅ 750 free compute hours/month
- ✅ Automatic deployments from GitHub
- ✅ Easy environment management

### What's Limited

- ⏸️ Service spins down after 15 minutes of inactivity
- 🐢 First request takes 30-60 seconds (cold start)
- 📊 Limited to ~512MB RAM
- 🔄 No auto-restart on crashes

### To Get 24/7 Uptime

- Upgrade to **"Starter"** plan ($7/month minimum)
- Service stays awake 24/7
- Better performance

---

## Your Deployed Backend

```
🎉 Your backend is now live at:

https://ecommerce-backend.onrender.com
```

### API Endpoints Available

- `GET /api/menu` - Get menu items
- `GET /api/products` - Get all products
- `GET /api/collections/:menuSlug` - Get products by menu
- `GET /api/collections/:menuSlug/:itemSlug` - Get products by submenu
- And more... (see your routes)

---

## Quick Reference: URLs

| What                 | URL                                                   |
| -------------------- | ----------------------------------------------------- |
| **Backend Base**     | `https://ecommerce-backend.onrender.com`              |
| **Menu API**         | `https://ecommerce-backend.onrender.com/api/menu`     |
| **Products API**     | `https://ecommerce-backend.onrender.com/api/products` |
| **Render Dashboard** | `https://dashboard.render.com`                        |
| **Logs**             | Render → Service → Logs tab                           |

---

## Complete Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created
- [ ] Environment variables added (all 8)
- [ ] Deployment complete (status: Live)
- [ ] Verified backend URL works in browser
- [ ] API endpoints tested
- [ ] MongoDB IP whitelist updated
- [ ] Frontend API URL updated
- [ ] Frontend tested with deployed backend
- [ ] Security: JWT_SECRET changed
- [ ] Secrets not in GitHub

---

## Done! 🎉

Your Node.js backend is now deployed on Render and accessible from anywhere!

**Next steps**:

1. Deploy your frontend (Vercel, Netlify, etc.)
2. Update frontend CORS if restricting domains
3. Monitor logs for any issues
4. Scale up to paid plan if needed for 24/7 uptime

---

**Need help?** Check Render Logs for specific error messages.
