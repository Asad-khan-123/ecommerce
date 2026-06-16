# ⚡ Quick Start Guide - 5 Minutes to Running

## Prerequisites ✅
- Node.js v16+ installed
- Google account
- MongoDB Atlas account
- Cloudinary account

## Step 1: Clone/Extract Project
```bash
# You already have the project - just navigate to it
cd ecommerce
```

## Step 2: Backend Setup (2 mins)

```bash
cd backend
npm install
```

**Create `.env` file with:**
```env
PORT=8000
DB_URL=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=supersecretkeychangethischangethischange
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Start server:**
```bash
npm run dev
```

✅ Backend running on `http://localhost:8000`

## Step 3: Frontend Setup (2 mins)

Open **new terminal window**:

```bash
cd frontend
npm install
```

**Create `.env.local` file with:**
```env
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

**Start server:**
```bash
npm run dev
```

✅ Frontend running on `http://localhost:5173`

## Step 4: Open in Browser (1 min)

1. Go to: **http://localhost:5173**
2. You should see navbar with "Shop", "Collections", "Tribe-88"
3. Click "Login" button
4. Sign in with Google

## Step 5: Create First Menu Item (1 min)

1. After login, click "Admin" in navbar
2. Go to "Menu Manager"
3. Click "Add Menu Item"
4. Title: `Shop` | Slug: `shop`
5. Save
6. Click "Shop" in left panel
7. Click "Add Column"
8. Change heading to "Categories"
9. Click "+ Add Item"
10. Label: `Shirts` | Link: `/shop/shirts`
11. Click "Save Changes"
12. Go back home, hover over "Shop" → See mega menu! 🎉

---

## 🔑 Where to Get Credentials

### Google Client ID (5 mins)
1. Go: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Go: Credentials → OAuth 2.0 Client ID (Web)
4. Add origin: `http://localhost:5173`
5. Copy Client ID

### MongoDB Connection (5 mins)
1. Go: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier)
3. Connect → Drivers → Node.js
4. Copy connection string
5. Replace `username`, `password`, `mydb`

### Cloudinary Credentials (2 mins)
1. Go: https://cloudinary.com/
2. Sign up free
3. Dashboard → Copy: Cloud Name, API Key, API Secret

---

## 📊 Commands Cheat Sheet

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Start server
node seed.js        # Seed database (optional)
```

### Frontend
```bash
cd frontend
npm install         # Install dependencies
npm run dev        # Start dev server
npm run build      # Build for production
```

---

## ✨ Features at a Glance

### Admin Can:
- ✅ Create unlimited menu items
- ✅ Add columns to each menu
- ✅ Add items with links to columns
- ✅ Upload images for mega menu
- ✅ Drag-drop to reorder everything
- ✅ Manage categories & collections
- ✅ See live changes on public site

### Public Can:
- ✅ Hover menu items to see mega menu (desktop)
- ✅ Tap menu for accordion view (mobile)
- ✅ Click items to navigate
- ✅ See full-width mega menu with images

---

## 🐛 99% Working? Common Fixes

**Menu not showing?**
- Refresh page
- Make sure `isActive: true` in admin

**Google login failed?**
- Check Client ID matches
- Verify Google Console has `http://localhost:5173` as origin

**Image upload failed?**
- Check Cloudinary credentials
- File must be < 50MB

**Can't access admin?**
- Make sure role is 'admin'
- Try logging out and back in

---

## 📚 Full Docs

- **Complete Setup**: Read `INSTALLATION.md`
- **Architecture**: Read `README.md`
- **What's Built**: Read `BUILD_SUMMARY.md`
- **Issues**: Read `SETUP_COMPLETE.md` troubleshooting section

---

## 🎉 You're Ready!

Both servers running? 
- Frontend: ✅ http://localhost:5173
- Backend: ✅ http://localhost:8000

Can you create a menu? ✅

**You're all set!** Start building! 🚀

---

**Stuck?** Check the full guides above. Everything is documented.
