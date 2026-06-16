# 🚀 START HERE - Get Your E-Commerce Running in 5 Minutes

## ✅ Dependencies Installed

All npm packages have been installed for both frontend and backend!

```
Frontend: ✅ @dnd-kit packages installed
Backend: ✅ All dependencies installed
```

## 🔧 Next Steps

### Step 1: Configure Environment Variables

#### Backend - Create `backend/.env`
```env
PORT=8000
DB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-change-this
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend - Create `frontend/.env.local`
```env
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server is running on port 8000
```

### Step 3: Start Frontend Server (New Terminal)

```bash
cd frontend
npm run dev
```

You should see:
```
Local:   http://localhost:5173/
```

### Step 4: Open in Browser

Go to: **http://localhost:5173**

You're done! 🎉

---

## 📋 Get Your Credentials

### Google Client ID (5 mins)
1. Go: https://console.cloud.google.com/
2. Create project → Enable "Google+ API"
3. Go: Credentials → Create "OAuth 2.0 Client ID" (Web)
4. Add origin: `http://localhost:5173`
5. Copy Client ID → Add to `.env` files

### MongoDB Connection (5 mins)
1. Go: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Connect → Drivers → Node.js
4. Copy connection string
5. Add to backend `.env`

### Cloudinary Credentials (2 mins)
1. Go: https://cloudinary.com/
2. Sign up free
3. Dashboard → Copy credentials
4. Add to backend `.env`

---

## ✨ Quick Test

After servers are running:

1. **Test Public Site**
   - Homepage should load
   - Navbar with dynamic menu

2. **Test Admin Login**
   - Click "Login" button
   - Sign in with Google
   - Redirected to admin if you have admin role

3. **Create Menu Item**
   - Go to Menu Manager
   - Add "Shop" menu
   - Add column "Categories"
   - Add item "Shirts"
   - See it appear in navbar!

---

## 🎯 Full Guides

- **Quick Setup**: `QUICK_START.md` (5 mins)
- **Detailed Setup**: `INSTALLATION.md` (30 mins)
- **Complete API Docs**: `README.md`
- **Architecture**: `BUILD_SUMMARY.md`
- **Troubleshooting**: `SETUP_COMPLETE.md`

---

## 🐛 Common Issues

**"Cannot find module" error?**
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

**Port already in use?**
```bash
# Kill process on port 8000
# Kill process on port 5173
# Then restart servers
```

**Google login not working?**
- Verify Client ID in both `.env` files
- Check Google Console has `http://localhost:5173` as origin
- Wait ~5 mins after adding origin

---

## 📊 Project Ready?

Check these before deploying:

- [ ] Backend `.env` with all credentials
- [ ] Frontend `.env.local` with Google Client ID
- [ ] MongoDB connection working
- [ ] Can login with Google
- [ ] Can create menu items
- [ ] Mega menu appears on navbar
- [ ] Images upload successfully

---

## 🎉 Congratulations!

Your full-stack e-commerce admin panel is ready to run!

**Next**: Read `QUICK_START.md` for command cheatsheet, or start both servers and begin managing your store!

---

**Questions?** Check the documentation files above or the README.md for complete API reference.

Good luck! 🚀
