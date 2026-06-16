# Cloudinary Image Upload Setup

## Configuration Files

### 1. Cloudinary Config (`backend/config/cloudinary.js`)
- Centralizes Cloudinary initialization
- Loads credentials from `.env`
- Logs confirmation on startup

### 2. Upload Routes (`backend/routes/upload.js`)
- Uses CloudinaryStorage for multer
- Endpoint: `POST /api/upload/admin/upload`
- Uploads to `ecommerce/menu` folder in Cloudinary
- Test endpoint: `GET /api/upload/admin/test-config`

### 3. Upload Controller (`backend/controllers/upload.js`)
- Handles file upload logic
- Returns `imageUrl` and `publicId` to frontend
- Includes error handling and logging

## Environment Variables
```
CLOUDINARY_NAME=dl3tcwp5s
CLOUDINARY_API_KEY=111665297538111
CLOUDINARY_API_SECRET=SXG5R_ShD9mv2w-Y_lwrifbr2u8
```

## How to Use

### Start Backend Server
```bash
cd backend
npm run dev
```
Should see: `✓ Cloudinary configured`

### Upload Image Flow
1. User selects image in Menu Manager
2. Frontend sends FormData to `/api/upload/admin/upload`
3. Backend uploads to Cloudinary via multer-storage-cloudinary
4. Response includes `imageUrl`
5. Frontend adds image to menu item
6. Admin clicks "Save Changes" to persist to database

### Test Cloudinary Configuration
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8000/api/upload/admin/test-config
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `ERR_CONNECTION_REFUSED` | Backend server not running - run `npm run dev` in backend folder |
| `Cannot read properties of undefined` | Cloudinary config file not imported - verify imports |
| `No file uploaded` | Frontend file not being sent - check FormData append |
| `Upload failed - no URL returned` | Cloudinary credentials invalid - verify .env values |

## File Structure
```
backend/
├── config/
│   └── cloudinary.js          (Cloudinary configuration)
├── routes/
│   └── upload.js              (Upload routes and multer setup)
├── controllers/
│   └── upload.js              (Upload handler logic)
└── .env                       (Credentials)
```
