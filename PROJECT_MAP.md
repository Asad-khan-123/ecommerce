# 🗺️ Project Map & Architecture

## 📁 Directory Structure

```
ecommerce/
│
├── 📄 README.md                          ← START HERE (Main documentation)
├── 📄 QUICK_START.md                     ← 5-minute setup
├── 📄 INSTALLATION.md                    ← Detailed setup guide
├── 📄 BUILD_SUMMARY.md                   ← What's been built
├── 📄 SETUP_COMPLETE.md                  ← Features overview
├── 📄 DELIVERY_CHECKLIST.md              ← Completion verification
├── 📄 PROJECT_MAP.md                     ← This file
│
├── 📁 backend/
│   ├── 📄 app.js                         ← Express server entry point
│   ├── 📄 seed.js                        ← Database seeding script
│   ├── 📄 package.json                   ← Dependencies
│   ├── 📄 .env                           ← Environment variables (update me!)
│   ├── 📄 .env.example                   ← Config reference
│   │
│   ├── 📁 utils/
│   │   ├── env.js                        ← Environment loader
│   │   └── db.js                         ← MongoDB connection
│   │
│   ├── 📁 models/
│   │   ├── user.js                       ← User schema (Google OAuth)
│   │   ├── menuItem.js                   ← Menu with columns/items/images
│   │   ├── category.js                   ← Categories
│   │   ├── collection.js                 ← Collections
│   │   └── product.js                    ← Existing
│   │
│   ├── 📁 controllers/
│   │   ├── auth.js                       ← Login/OAuth logic
│   │   ├── menu.js                       ← Menu CRUD
│   │   ├── category.js                   ← Category CRUD
│   │   ├── collection.js                 ← Collection CRUD
│   │   ├── upload.js                     ← Image upload
│   │   └── user.js                       ← Existing
│   │
│   ├── 📁 middlewares/
│   │   └── authmiddleware.js             ← JWT & admin verification
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                       ← /api/auth routes
│   │   ├── menu.js                       ← /api/menu routes
│   │   ├── category.js                   ← /api/categories routes
│   │   ├── collection.js                 ← /api/collections routes
│   │   ├── upload.js                     ← /api/upload routes
│   │   └── [other existing routes]
│   │
│   ├── 📁 config/
│   │   └── [existing config]
│   │
│   ├── 📁 node_modules/                  ← Dependencies (auto-installed)
│   └── 📁 .git/                          ← Version control
│
└── 📁 frontend/
    ├── 📄 package.json                   ← Dependencies
    ├── 📄 .env.local                     ← Environment variables (update me!)
    ├── 📄 .env.example                   ← Config reference
    ├── 📄 vite.config.ts                 ← Vite configuration
    ├── 📄 tsconfig.json                  ← TypeScript config
    ├── 📄 tailwind.config.cjs             ← Tailwind configuration
    ├── 📄 postcss.config.cjs              ← PostCSS configuration
    ├── 📄 index.html                     ← HTML entry point
    ├── 📄 eslint.config.js               ← ESLint config
    │
    └── 📁 src/
        ├── 📄 App.tsx                    ← Main router & layout
        ├── 📄 main.tsx                   ← React entry point
        ├── 📄 index.css                  ← Global styles
        │
        ├── 📁 context/
        │   └── AuthContext.tsx           ← Authentication state (useAuth hook)
        │
        ├── 📁 utils/
        │   └── api.ts                    ← API calls helper
        │
        ├── 📁 pages/
        │   ├── Login.tsx                 ← Google OAuth login page
        │   │
        │   └── 📁 admin/
        │       ├── Dashboard.tsx         ← Admin stats
        │       ├── MenuManager.tsx       ← ⭐ MAIN FEATURE: Menu CRUD + drag-drop
        │       ├── Categories.tsx        ← Category CRUD
        │       └── Collections.tsx       ← Collection CRUD
        │
        ├── 📁 components/
        │   ├── Navbar.tsx                ← ⭐ PUBLIC: Dynamic mega menu navbar
        │   ├── AdminLayout.tsx           ← Admin sidebar + routing
        │   ├── AdminRoute.tsx            ← Protected route wrapper
        │   ├── SortableMenuItem.tsx      ← Draggable menu item
        │   ├── Footer.tsx                ← Existing
        │   └── NewsletterWithAnnouncement.tsx ← Existing
        │
        ├── 📁 assets/
        │   └── [images/icons]
        │
        ├── 📁 public/
        │   ├── favicon.svg
        │   └── icons.svg
        │
        └── 📁 node_modules/             ← Dependencies (auto-installed)
```

---

## 🔄 Data Flow Diagram

### Authentication Flow
```
User Login
    ↓
Google OAuth Button
    ↓
Google Login Popup
    ↓
idToken to Backend (/api/auth/google)
    ↓
Backend verifies with Google
    ↓
Create/Find User in MongoDB
    ↓
Generate JWT Token
    ↓
Return Token + User Data
    ↓
Frontend stores in localStorage
    ↓
Set Authorization Header for future requests
    ↓
Redirect to Admin Dashboard
```

### Menu Management Flow
```
Admin Creates Menu Item
    ↓
POST /api/menu/admin
    ↓
Backend validates & saves to MongoDB
    ↓
Returns menu with ID
    ↓
Frontend adds to state
    ↓
Admin adds columns to menu
    ↓
Admin adds items to columns
    ↓
Admin uploads images to Cloudinary
    ↓
Frontend receives image URLs
    ↓
Admin clicks "Save Changes"
    ↓
PUT /api/menu/admin/:id
    ↓
Backend updates in MongoDB
    ↓
Frontend refreshes menu list
    ↓
Success message shown
```

### Public Mega Menu Flow
```
User visits site
    ↓
Frontend loads
    ↓
Navbar component mounts
    ↓
useEffect calls GET /api/menu
    ↓
Backend returns active menu items
    ↓
Frontend renders navbar items
    ↓
User hovers over menu item
    ↓
Mega menu dropdown shows
    ↓
Displays columns + images
    ↓
User clicks item link
    ↓
Navigate to category/collection
```

---

## 🔌 API Routes Map

### Authentication Routes
```
POST   /api/auth/google       → Login with Google token
GET    /api/auth/me           → Get current user
```

### Menu Routes
```
GET    /api/menu              → Get active menus (PUBLIC)
GET    /api/menu/admin/all    → Get all menus (ADMIN)
POST   /api/menu/admin        → Create menu (ADMIN)
PUT    /api/menu/admin/:id    → Update menu (ADMIN)
DELETE /api/menu/admin/:id    → Delete menu (ADMIN)
POST   /api/menu/admin/reorder → Reorder menus (ADMIN)
```

### Category Routes
```
GET    /api/categories        → Get active (PUBLIC)
GET    /api/categories/admin/all → Get all (ADMIN)
POST   /api/categories/admin  → Create (ADMIN)
PUT    /api/categories/admin/:id → Update (ADMIN)
DELETE /api/categories/admin/:id → Delete (ADMIN)
```

### Collection Routes
```
GET    /api/collections       → Get active (PUBLIC)
GET    /api/collections/admin/all → Get all (ADMIN)
POST   /api/collections/admin → Create (ADMIN)
PUT    /api/collections/admin/:id → Update (ADMIN)
DELETE /api/collections/admin/:id → Delete (ADMIN)
```

### Upload Routes
```
POST   /api/upload/admin/upload → Upload image to Cloudinary (ADMIN)
```

---

## 📊 Database Schema Relationships

```
Users (1)
  ├── id (PK)
  ├── email (unique)
  ├── role (admin/user)
  ├── googleId
  └── avatar

MenuItems (many)
  ├── id (PK)
  ├── title
  ├── slug (unique)
  ├── order
  ├── columns (array of sub-documents)
  │   ├── heading
  │   ├── order
  │   └── items (array of sub-documents)
  │       ├── label
  │       ├── link
  │       └── order
  └── images (array of sub-documents)
      ├── imageUrl (from Cloudinary)
      ├── imageTitle
      └── order

Categories (many)
  ├── id (PK)
  ├── name
  ├── slug (unique)
  ├── parentMenu (reference to MenuItem)
  ├── image
  └── order

Collections (many)
  ├── id (PK)
  ├── name
  ├── slug (unique)
  ├── group (recent/curated)
  ├── parentMenu (default: "collections")
  └── order
```

---

## 🎨 Component Hierarchy

```
App (Router)
├── Public Routes
│   ├── Login
│   │   └── Google OAuth Button
│   │
│   └── Home (Layout)
│       ├── Navbar ⭐ MAIN FEATURE
│       │   ├── Logo
│       │   ├── Menu Items (from DB)
│       │   │   └── Mega Menu Dropdown
│       │   │       ├── Columns (2 cols)
│       │   │       │   └── Items with Links
│       │   │       └── Images (2 cols)
│       │   └── Icons + Auth Links
│       │
│       ├── Main Content
│       │
│       ├── Newsletter
│       │
│       └── Footer
│
└── Admin Routes (Protected)
    └── AdminLayout
        ├── Sidebar Navigation
        │   ├── Dashboard
        │   ├── Menu Manager
        │   ├── Categories
        │   ├── Collections
        │   └── Logout
        │
        └── Main Content Area (Outlet)
            ├── Dashboard
            │   └── Stats Cards
            │
            ├── MenuManager ⭐ MAIN FEATURE
            │   ├── Menu List (Sortable)
            │   │   └── SortableMenuItem (Draggable)
            │   │
            │   └── Editor Panel
            │       ├── Columns Management
            │       ├── Items Management
            │       └── Image Upload
            │
            ├── Categories
            │   ├── Category List (Table)
            │   └── CRUD Form
            │
            └── Collections
                ├── Collection List (Table)
                └── CRUD Form
```

---

## 🔐 Authentication & Authorization Flow

```
Login Page
├── Google Auth Button
└── On Click:
    ├── Google OAuth popup
    ├── User approves
    ├── idToken sent to /api/auth/google
    ├── Backend verifies token
    ├── Create/Find user in DB
    ├── Generate JWT
    ├── Return token + user
    └── Frontend:
        ├── Stores token in localStorage
        ├── Stores user in localStorage
        ├── Sets Auth Context
        └── Redirects to /admin or /

Protected Routes:
├── AdminRoute component
│   ├── Checks useAuth hook
│   ├── If no user → redirect /login
│   ├── If user.role !== 'admin' → redirect /login
│   └── Else → render admin layout

API Requests:
├── All requests include:
│   ├── Header: Authorization: Bearer {token}
│   └── Sent via api.ts helpers
├── Backend middleware (protect):
│   ├── Checks Authorization header
│   ├── Verifies JWT with JWT_SECRET
│   ├── Finds user from token
│   └── Attaches to req.user
└── Admin routes also check:
    ├── adminOnly middleware
    ├── Verifies req.user.role === 'admin'
    └── Returns 403 if not admin
```

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├── Hamburger menu toggle
├── Stacked layout
├── Mobile menu accordion
├── Touch-friendly buttons
└── Single column content

Tablet (768px - 1024px)
├── Collapsible sidebar
├── 2-column layouts
├── Optimized spacing
└── Medium touch targets

Desktop (> 1024px)
├── Full sidebar always visible
├── Multi-column layouts
├── Mega menu on hover
├── Full-width content
└── Optimized for mouse
```

---

## 🚀 Deployment Architecture

```
Frontend (Vercel/Netlify)
├── Build: npm run build
├── Static files to CDN
└── API calls to backend

Backend (Heroku/Railway/Render)
├── Environment variables set
├── MongoDB Atlas connection
├── Cloudinary integration
└── Running on dynamic port

Database (MongoDB Atlas)
├── Hosted in cloud
├── Auto-backups
└── Scalable

Images (Cloudinary CDN)
├── Auto-optimized
├── Global CDN
└── Responsive sizing
```

---

## 📚 File Reference Guide

### Must Read Files
1. **README.md** - Complete documentation
2. **QUICK_START.md** - Fast setup
3. **App.tsx** - Routing logic
4. **MenuManager.tsx** - Complex admin component
5. **Navbar.tsx** - Public mega menu

### Backend Key Files
1. **app.js** - Server setup
2. **models/*.js** - Database schemas
3. **controllers/auth.js** - OAuth flow
4. **controllers/menu.js** - Menu logic
5. **middlewares/authmiddleware.js** - Auth

### Configuration Files
1. **backend/.env** - Backend config
2. **frontend/.env.local** - Frontend config
3. **package.json** (both) - Dependencies
4. **vite.config.ts** - Build config
5. **tailwind.config.cjs** - Styling

---

## 🎯 Key Components

### Frontend Components

**Navbar.tsx** (⭐ PUBLIC FEATURE)
- Displays dynamic menu from API
- Shows mega menu on hover (desktop)
- Shows accordion menu (mobile)
- Full-width layout with columns + images
- Links to categories/collections

**MenuManager.tsx** (⭐ ADMIN FEATURE)
- Create/edit/delete menu items
- Add columns and items
- Upload images to Cloudinary
- Drag-and-drop reordering (@dnd-kit)
- Save changes to database

**AdminLayout.tsx**
- Sidebar navigation
- Mobile menu toggle
- User info & logout
- Responsive design

### Backend Controllers

**auth.js**
- Google OAuth verification
- JWT token generation
- User creation/retrieval
- Login flow

**menu.js**
- CRUD operations
- Reorder logic
- Validation
- Active/inactive filtering

---

## 🔄 Request/Response Examples

### Login Request
```javascript
POST /api/auth/google
{
  idToken: "google-token-string"
}

Response:
{
  success: true,
  token: "jwt-token",
  user: {
    id: "user-id",
    name: "User Name",
    email: "user@gmail.com",
    role: "admin"
  }
}
```

### Create Menu
```javascript
POST /api/menu/admin
Headers: Authorization: Bearer {token}
{
  title: "Shop",
  slug: "shop",
  columns: [],
  images: []
}

Response:
{
  success: true,
  data: { _id, title, slug, ... }
}
```

### Get Menus (Public)
```javascript
GET /api/menu

Response:
{
  success: true,
  data: [
    {
      _id: "...",
      title: "Shop",
      slug: "shop",
      columns: [...],
      images: [...]
    },
    ...
  ]
}
```

---

## ✅ Success Indicators

When everything is working:

✅ Backend starts on port 8000
✅ Frontend starts on port 5173
✅ Can see navbar with menu items
✅ Can login with Google
✅ Admin dashboard loads
✅ Can create menu items
✅ Drag-drop works in admin
✅ Images upload to Cloudinary
✅ Mega menu shows on navbar
✅ All CRUD operations work

---

## 🎓 Learning Path

### Day 1: Setup & Understanding
- [ ] Read QUICK_START.md
- [ ] Install dependencies
- [ ] Start both servers
- [ ] Explore admin dashboard

### Day 2: Admin Features
- [ ] Create menu items
- [ ] Add columns & items
- [ ] Upload images
- [ ] Practice drag-drop

### Day 3: Public Features
- [ ] View navbar
- [ ] Test mega menu
- [ ] Check mobile responsiveness
- [ ] Create more items

### Day 4+: Customization
- [ ] Change colors
- [ ] Modify fonts
- [ ] Add features
- [ ] Deploy to production

---

This map covers everything in the project. Use it as a reference guide!

**Need more detail?** Check the specific documentation file for that section.

**Happy building!** 🚀
