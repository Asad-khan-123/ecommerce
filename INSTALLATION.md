# 📦 Complete Installation Guide

Follow these steps to get your MERN e-commerce store running locally.

## Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (Atlas or local) ([Setup Atlas](https://www.mongodb.com/cloud/atlas))
- **Google Account** (for OAuth)
- **Cloudinary Account** ([Free signup](https://cloudinary.com/users/register))

---

## Step 1: Database Setup (MongoDB)

### Option A: MongoDB Atlas (Recommended - Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or login
3. Create a new organization
4. Create a project (e.g., "ecommerce")
5. Click "Build a Cluster"
6. Choose:
   - Cloud Provider: **AWS**
   - Region: Closest to you
   - Cluster Tier: **M0 Free** (for development)
7. Wait for cluster to create (5-10 minutes)
8. Click "Connect"
9. Choose "Drivers"
10. Select **Node.js** version **4.x**
11. Copy the connection string, replace:
    - `<username>` with your database user
    - `<password>` with your database password
    - `myFirstDatabase` → your database name (e.g., `ecommerce`)

Example: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority`

### Option B: Local MongoDB

```bash
# Install MongoDB Community on your system
# macOS: brew install mongodb-community
# Windows: Download installer from mongodb.com
# Linux: sudo apt-get install mongodb

# Connection string: mongodb://localhost:27017/ecommerce
```

---

## Step 2: Google OAuth Setup

### Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name: "431-88 E-Commerce" → Click "Create"
4. Wait for project to be created
5. In search bar, search "Google+ API"
6. Click it → Click "Enable"
7. Go to "Credentials" in left sidebar
8. Click "Create Credentials" → "OAuth 2.0 Client ID"
9. Choose application type: **Web Application**
10. Name: "431-88 Frontend"
11. Add Authorized JavaScript origins:
    - `http://localhost:5173` (Vite dev server)
    - `http://localhost:3000` (if using this port)
12. Add Authorized redirect URIs:
    - `http://localhost:5173/login` (optional)
    - `http://localhost:8000/api/auth/callback` (optional)
13. Click "Create"
14. Copy the **Client ID** (long string like `xxx.apps.googleusercontent.com`)
15. Save this somewhere safe - you'll need it!

---

## Step 3: Cloudinary Setup

### Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up (free account)
3. Go to Dashboard
4. You'll see:
   - **Cloud Name** (top of dashboard)
   - **API Key**
   - **API Secret** (click to reveal)
5. Save all three - you'll need them!

---

## Step 4: Backend Installation & Configuration

### Clone and Install

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

### Configure Environment Variables

Create `.env` file in `backend` folder with:

```env
# Server
PORT=8000

# Database
DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT (create a random string - at least 32 characters)
JWT_SECRET=your-super-secret-key-change-this-change-this-change-this

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Test Backend

```bash
# From backend folder, run:
npm run dev
```

You should see:
```
Connected to database successfully
Server is running on port 8000
```

✅ If yes, backend is working!

### Seed Database (Optional but Recommended)

Creates an admin user and sample menus:

```bash
# From backend folder:
node seed.js
```

You'll see:
```
Connected to database
Admin user created: admin@example.com
Shop menu created
Collections menu created
Tribe-88 menu created
Database seeding completed successfully!
```

---

## Step 5: Frontend Installation & Configuration

### Install Dependencies

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
```

### Configure Environment Variables

Create `.env.local` file in `frontend` folder:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Start Frontend

```bash
# From frontend folder:
npm run dev
```

You should see:
```
  VITE v8.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

✅ Frontend is running!

---

## Step 6: Test the Application

### Open in Browser

1. Frontend: http://localhost:5173
2. Backend API: http://localhost:8000

### Test Public Site

1. Visit http://localhost:5173
2. You should see navbar with "Shop", "Collections", "Tribe-88"
3. Hover over menu items (desktop)
4. You should see the mega menu dropdown

### Test Admin Login

1. Click "Login" button in navbar
2. Sign in with your Google account
3. After login, should redirect to admin dashboard
4. Click "Admin" button in navbar to go to admin panel

### Create Your First Menu Item

1. In admin panel, go to "Menu Manager"
2. Click "Add Menu Item"
3. Title: "Shop", Slug: "shop"
4. Click "Save"
5. Select "Shop" in the left panel
6. Click "Add Column"
7. Change column heading to "Categories"
8. Click "+ Add Item"
9. Add item: Label: "Blouses", Link: "/shop/blouses"
10. Upload an image
11. Click "Save Changes"
12. Go to homepage and hover over "Shop" - you should see it!

---

## 📋 Verification Checklist

- [ ] Backend `.env` file created with all fields
- [ ] MongoDB connection working (check backend logs)
- [ ] Frontend `.env.local` file created
- [ ] Frontend can access http://localhost:5173
- [ ] Backend API accessible at http://localhost:8000
- [ ] Google OAuth login button visible on login page
- [ ] Can create menu items in admin panel
- [ ] Menu items appear in navbar mega menu

---

## 🆘 Troubleshooting

### Backend won't start

**Error: "Cannot find module 'express'"**
```bash
cd backend
npm install
```

**Error: "MongooseConnectionError"**
- Check MongoDB connection string in `.env`
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure database user password is correct

**Error: "GOOGLE_CLIENT_ID not found"**
- Make sure `.env` file exists in backend folder
- Check you saved `.env` (not `.env.txt` or `.example`)
- Restart dev server after adding `.env`

### Frontend won't start

**Error: "VITE_GOOGLE_CLIENT_ID is undefined"**
- Create `.env.local` file in frontend folder (not just `.env`)
- Add `VITE_GOOGLE_CLIENT_ID=your-client-id`
- Restart dev server

**Error: "CORS error"**
- Backend CORS is already configured for `http://localhost:5173`
- If still getting error, check backend is running on port 8000
- Verify `api.ts` uses correct URL: `http://localhost:8000/api`

### Google OAuth not working

**Error: "Invalid Client ID"**
- Copy Client ID exactly from Google Console (no spaces)
- Make sure it ends with `.apps.googleusercontent.com`

**Error: "Redirect URI mismatch"**
- Go to Google Console → Credentials
- Edit OAuth 2.0 Client ID
- Add `http://localhost:5173` to Authorized JavaScript origins
- Save and wait ~5 minutes for changes to apply

### Image upload not working

**Error: "Cloudinary API Error"**
- Verify `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Restart backend after adding Cloudinary credentials
- File must be less than 50MB

### Can't login as admin

**Error: "Admin access required"**
- Make sure you seeded database with `node seed.js`
- Or manually update user in MongoDB:
  ```javascript
  db.users.updateOne(
    { email: "your-email@gmail.com" },
    { $set: { role: "admin" } }
  )
  ```

---

## 🚀 You're Ready!

If you reached here, your entire system is running! 

### Next Steps:

1. **Explore Admin Panel**
   - Create menu items
   - Upload images
   - Add categories and collections
   - Reorder items with drag-drop

2. **Customize**
   - Update colors in `tailwind.config.cjs`
   - Change fonts in Navbar
   - Modify styling to match your brand

3. **Extend Features**
   - Add products model
   - Create product pages
   - Build shopping cart
   - Add checkout

4. **Deploy**
   - Backend → Heroku, Railway, Render
   - Frontend → Vercel, Netlify
   - Database → Keep MongoDB Atlas

---

## 📞 Still Having Issues?

1. Check all `.env` files are created correctly
2. Verify all API keys from Google, Cloudinary, MongoDB
3. Make sure ports 5173 (frontend) and 8000 (backend) are not in use
4. Try clearing node_modules and reinstalling:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
5. Restart your dev servers

Good luck! 🎉
