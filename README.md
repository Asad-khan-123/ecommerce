# 431-88 E-Commerce Admin Panel + Dynamic Mega Menu System

A complete MERN stack e-commerce solution with dynamic mega menu system controlled by admin dashboard. Built with React, Vite, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

✨ **Dynamic Mega Menu System**
- Admin-controlled menu items with drag-and-drop reordering
- Full-width mega menu with columns and images
- Mobile-responsive design
- Real-time updates on public site

🔐 **Authentication**
- Google OAuth 2.0 integration
- JWT token-based authentication
- Admin role-based access control

📊 **Admin Dashboard**
- Complete CRUD operations for menus, categories, and collections
- Drag-and-drop menu reorganization
- Image upload to Cloudinary
- Stats overview

🎨 **Frontend**
- React 19 + Vite for fast development
- TypeScript for type safety
- Tailwind CSS for styling
- React Router for navigation
- lucide-react & react-icons for icons

💾 **Backend**
- Node.js + Express API
- MongoDB with Mongoose
- Multer + Cloudinary for image uploads
- Google Auth Library for OAuth verification

## Prerequisites

- Node.js (v16+)
- MongoDB account (Atlas or local)
- Google OAuth credentials
- Cloudinary account

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=8000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Run Seed Script (Optional - Creates first admin user)

```bash
node seed.js
```

This creates:
- Admin user: `admin@example.com` with role `admin`
- Sample menu items with columns

#### Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` folder:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Credential (Web Application)
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Add authorized redirect URIs: `http://localhost:8000/api/auth/callback` (if needed)
7. Copy the Client ID and add to `.env` files

### 4. Setup Cloudinary

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Add to backend `.env`

## Project Structure

### Backend

```
backend/
├── controllers/        # Request handlers
│   ├── auth.js
│   ├── menu.js
│   ├── category.js
│   ├── collection.js
│   └── upload.js
├── models/            # Mongoose schemas
│   ├── user.js
│   ├── menuItem.js
│   ├── category.js
│   └── collection.js
├── routes/            # API routes
│   ├── auth.js
│   ├── menu.js
│   ├── category.js
│   ├── collection.js
│   └── upload.js
├── middlewares/       # Auth & custom middleware
│   └── authmiddleware.js
├── utils/            # Helper functions
│   ├── db.js
│   └── env.js
├── app.js            # Express app setup
├── seed.js           # Database seeding
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Main navbar with mega menu
│   │   ├── AdminLayout.tsx       # Admin sidebar layout
│   │   ├── AdminRoute.tsx        # Protected route wrapper
│   │   └── SortableMenuItem.tsx  # Draggable menu item
│   ├── pages/
│   │   ├── Login.tsx             # Google OAuth login
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── MenuManager.tsx   # Menu CRUD + drag-drop
│   │       ├── Categories.tsx
│   │       └── Collections.tsx
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state management
│   ├── utils/
│   │   └── api.ts                # API calls
│   ├── App.tsx                   # Main routing
│   └── main.tsx
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user (protected)

### Menu (Admin Routes - Protected)
- `GET /api/menu` - Get active menu items (public)
- `GET /api/menu/admin/all` - Get all menu items
- `POST /api/menu/admin` - Create menu item
- `PUT /api/menu/admin/:id` - Update menu item
- `DELETE /api/menu/admin/:id` - Delete menu item
- `POST /api/menu/admin/reorder` - Reorder menu items

### Categories
- `GET /api/categories` - Get active categories (public)
- `GET /api/categories/admin/all` - Get all categories
- `POST /api/categories/admin` - Create category
- `PUT /api/categories/admin/:id` - Update category
- `DELETE /api/categories/admin/:id` - Delete category

### Collections
- `GET /api/collections` - Get active collections (public)
- `GET /api/collections/admin/all` - Get all collections
- `POST /api/collections/admin` - Create collection
- `PUT /api/collections/admin/:id` - Update collection
- `DELETE /api/collections/admin/:id` - Delete collection

### Upload
- `POST /api/upload/admin/upload` - Upload image to Cloudinary (protected, admin only)

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  avatar: String,
  googleId: String (unique, sparse),
  password: String (optional for OAuth users),
  role: Enum ['user', 'admin'],
  createdAt: Date
}
```

### MenuItem
```javascript
{
  title: String,
  slug: String (unique),
  order: Number,
  isActive: Boolean,
  columns: [{
    heading: String,
    order: Number,
    items: [{
      label: String,
      link: String,
      order: Number
    }]
  }],
  images: [{
    imageUrl: String,
    imageTitle: String,
    order: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  name: String,
  slug: String (unique),
  parentMenu: String,
  image: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### Collection
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  bannerImage: String,
  group: Enum ['recent', 'curated'],
  parentMenu: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date
}
```

## Usage Flow

### Admin Workflow

1. **Login**
   - Visit `http://localhost:5173/login`
   - Sign in with Google
   - Redirected to admin dashboard if role is 'admin'

2. **Manage Menu**
   - Go to Menu Manager
   - Add new top-level menu like "Shop"
   - Click to select and add columns (e.g., "View All", "Categories")
   - Add items to each column with label and link
   - Upload images for mega menu right side
   - Drag to reorder menus, columns, and items
   - Save changes

3. **Manage Categories**
   - Create categories linked to menus
   - Assign to "shop" or "collections" parent menu

4. **Manage Collections**
   - Create collections with recent/curated group
   - Assign to "collections" menu

### Public Navigation

1. **View Mega Menu**
   - Hover over navbar items (Desktop)
   - See full-width mega menu with columns and images
   - Click items to navigate

2. **Mobile Menu**
   - Tap menu icon
   - Navigate through collapsible menu structure

## Styling

- **Font**: Poppins (configured in Tailwind)
- **Text Color**: #212121
- **Background**: White
- **Admin Sidebar**: #1a1a1a
- **Hover Effects**: Smooth transitions
- **Icons**: lucide-react (18px default)

## Features Implemented

✅ Complete backend with models and controllers
✅ Google OAuth 2.0 authentication
✅ JWT token management
✅ Admin role-based access control
✅ Full CRUD for menus, categories, collections
✅ Drag-and-drop menu reordering (@dnd-kit)
✅ Image upload to Cloudinary
✅ Full-width mega menu on hover
✅ Mobile-responsive admin dashboard
✅ Mobile-friendly navigation
✅ Protected admin routes
✅ Database seeding script
✅ Environment configuration
✅ API interceptors with auth tokens
✅ Loading states and error handling

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 8000)
- `DB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `CLOUDINARY_NAME` - Cloudinary account name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend (.env.local)
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID

## Troubleshooting

### CORS Issues
- Ensure backend CORS is configured for frontend URL
- Check `app.js` cors configuration

### Google OAuth Not Working
- Verify GOOGLE_CLIENT_ID is correct
- Check authorized origins in Google Console
- Ensure frontend is accessing from `http://localhost:5173`

### Cloudinary Upload Failed
- Verify CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Check file size (max 50MB)
- Ensure multer-storage-cloudinary is installed

### Menu Items Not Showing
- Check if `isActive` is true
- Verify menu was created in admin panel
- Check browser console for API errors

### Admin Access Denied
- Verify user role is 'admin' in database
- Check JWT token is stored in localStorage
- Try logging out and logging back in

## Production Deployment

### Backend
```bash
# Build
npm run build

# Deploy to Heroku/Railway/Vercel
# Set environment variables in deployment platform
```

### Frontend
```bash
# Build
npm run build

# Deploy to Vercel/Netlify
# Set VITE_GOOGLE_CLIENT_ID in deployment platform
```

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
