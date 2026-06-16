# Image Upload Debugging Guide

## Error Handling Stages Added

### Backend (Server Startup)
**File:** `backend/config/cloudinary.js`
- **STAGE 1:** Checks if all environment variables are present
- **STAGE 2:** Verifies cloudinary object structure and methods
- **STAGE 3:** Attempts to configure Cloudinary with credentials
- **STAGE 4:** Verifies configuration was successful

**File:** `backend/routes/upload.js`
- **STAGE 1:** Initializes multer-storage-cloudinary
- **STAGE 2:** Creates CloudinaryStorage instance
- **STAGE 3:** Creates multer instance with storage
- Plus error handlers for multer and general errors

### Backend (Upload Request)
**File:** `backend/controllers/upload.js`
- **STAGE 1:** Checks if file exists in request
- **STAGE 2:** Checks Cloudinary upload result (looks for URL properties)
- **STAGE 3:** Validates URL format (must start with http)
- **STAGE 4:** Prepares success response

## How to Debug

### Step 1: Start Backend and Check Console
```bash
cd backend
npm run dev
```

**Look for output like:**
```
[STAGE 1] Checking environment variables...
✓ CLOUDINARY_NAME: dl3tcwp5s
✓ CLOUDINARY_API_KEY: ...111
✓ CLOUDINARY_API_SECRET: ...u8

[STAGE 2] Checking cloudinary object structure...
cloudinary type: object
cloudinary.v2 exists: true
cloudinary.v2.uploader exists: true
cloudinary.v2.uploader.upload_stream exists: function

[STAGE 3] Configuring Cloudinary with credentials...
✓ Cloudinary v2 configured successfully

[STAGE 4] Verifying Cloudinary configuration...
✓ Cloudinary is properly configured
  - Cloud Name: dl3tcwp5s

[READY] Cloudinary upload ready
```

**If you see errors, note which STAGE failed:**
- STAGE 1 error = missing environment variables
- STAGE 2 error = cloudinary package not installed or wrong version
- STAGE 3 error = cloudinary configuration failed
- STAGE 4 error = configuration didn't persist

### Step 2: Try Uploading Image

In Menu Manager, select an image and upload.

### Step 3: Check Server Console Output

**Success flow:**
```
[UPLOAD ROUTES] Stage 1: Initializing multer-storage-cloudinary...
[UPLOAD ROUTES] Stage 2: Creating CloudinaryStorage...
✓ CloudinaryStorage created successfully
[UPLOAD ROUTES] Stage 3: Creating multer instance...
✓ Multer instance created successfully

[UPLOAD CONTROLLER] ========== START IMAGE UPLOAD ==========
[STAGE 1] Checking if file exists in request...
✓ File found: {
  fieldname: 'image',
  originalname: 'WhatsApp Image 2026-06-03 at 11.22.26.jpeg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 123456
}

[STAGE 2] Checking Cloudinary upload result...
✓ Image URL obtained: https://res.cloudinary.com/dl3tcwp5s/image/upload/...

[STAGE 3] Validating URL format...
✓ URL format is valid

[STAGE 4] Preparing success response...
✓ Response prepared: { success: true, imageUrl: '...', ... }
[UPLOAD CONTROLLER] ========== UPLOAD COMPLETE ==========
```

**If upload fails, look for which STAGE failed:**
- STAGE 1 failed = File not reaching backend
- STAGE 2 failed = Cloudinary didn't upload (check credentials)
- STAGE 3 failed = URL format wrong
- STAGE 4 failed = Unexpected error

## Common Issues and Solutions

| Error Output | Cause | Solution |
|--------------|-------|----------|
| `Cannot read properties of undefined (reading 'uploader')` | Wrong import of cloudinary | Should be `import cloudinary from 'cloudinary'` not `{ v2 as cloudinary }` |
| `❌ CLOUDINARY_NAME is missing` | Env variable not set | Add to backend/.env: `CLOUDINARY_NAME=your_name` |
| `✓ File found` but no STAGE 2 | Cloudinary config failed | Check STAGE 1 output on server startup |
| `ERR_CONNECTION_REFUSED` | Backend not running | Run `npm run dev` in backend folder |
| `❌ No file in request` | Frontend didn't send file | Check frontend console for upload errors |

## What Each Response Includes

When upload succeeds (status 200):
```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "ecommerce/menu/...",
  "message": "Image uploaded successfully"
}
```

When upload fails (includes stage info to help debug):
```json
{
  "success": false,
  "stage": "stage2_cloudinary_url",
  "message": "Cloudinary upload failed - no URL returned",
  "file_properties": ["path", "secure_url", "filename", ...]
}
```
