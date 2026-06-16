# Image Upload & Database Save Flow

## Complete Flow - Already Implemented ✅

### 1. Frontend - Upload Image (MenuManager.tsx)
```
User selects image in Menu Manager
↓
handleImageUpload() is called
↓
Frontend sends image file to: POST /api/upload/admin/upload
↓
Cloudinary uploads and returns imageUrl
↓
Frontend receives imageUrl from response
↓
Creates newImage object:
{
  imageUrl: "https://res.cloudinary.com/...",
  imageTitle: "New Image",
  order: 0
}
↓
Adds to selectedMenuItem.images array
↓
Image displays in preview (user can edit title)
```

### 2. Frontend - Save Menu Item (MenuManager.tsx)
```
User clicks "Save Changes" button
↓
handleSaveMenuItem() is called
↓
Frontend sends PUT request to: /api/menu/admin/{id}
↓
Payload includes:
{
  title: "Shop",
  slug: "shop",
  columns: [...],
  images: [
    {
      imageUrl: "https://res.cloudinary.com/...",
      imageTitle: "New Image",
      order: 0
    }
  ]
}
```

### 3. Backend - Save to Database (menu.js controller)
```
Backend receives PUT request
↓
Extracts images array from request body
↓
Finds MenuItem by ID
↓
Updates menuItem.images = images
↓
Calls await menuItem.save()
↓
MongoDB saves image URLs to database
↓
Returns saved menuItem with all images
```

### 4. Frontend - Display in Navbar (Navbar.tsx)
```
Navbar fetches menu items: GET /api/menu
↓
Receives menuItems with images array
↓
Maps through images
↓
Displays in mega menu right side (2-column grid)
↓
<img src={image.imageUrl} alt={image.imageTitle} />
```

## Database Schema (MenuItem)
```javascript
images: [{
  imageUrl: String,          // Cloudinary URL
  imageTitle: String,        // User-defined title
  order: Number              // Display order
}]
```

## How It Works

1. **Upload**: Image → Cloudinary → Get URL
2. **Store**: URL → Frontend State → User edits/previews
3. **Save**: Images array → Backend → MongoDB
4. **Display**: Fetch from DB → Navbar → Show in mega menu

## Testing Flow

1. ✅ Start backend: `npm run dev`
2. ✅ Start frontend: `npm run dev`
3. ✅ Login to admin
4. ✅ Go to Menu Manager
5. ✅ Select a menu item (e.g., "Shop")
6. ✅ Click "Click to upload image" in "Mega Menu Images" section
7. ✅ Select an image file
8. ✅ Image uploads to Cloudinary (you'll see image preview)
9. ✅ Edit image title if desired
10. ✅ Click "Save Changes"
11. ✅ Images are saved to MongoDB
12. ✅ Go to homepage, hover over menu item
13. ✅ See images in mega menu display

## File References

**Frontend:**
- `src/pages/admin/MenuManager.tsx` - Upload & save logic
- `src/components/Navbar.tsx` - Display mega menu with images
- `src/utils/api.ts` - API calls

**Backend:**
- `config/cloudinary.js` - Cloudinary configuration
- `routes/upload.js` - Upload endpoint setup
- `controllers/upload.js` - Handle file upload
- `controllers/menu.js` - Save menu items with images
- `models/menuItem.js` - Database schema

**Everything is working correctly!** 🎉
