import { v2 as cloudinary } from 'cloudinary';
import '../config/cloudinary.js'; // Ensure config runs

/**
 * Extracts Cloudinary public_id from a full image/file URL.
 * Example URL:
 * https://res.cloudinary.com/dl3tcwp5s/image/upload/v1782539663/ecommerce/menu/xy1234abc.png
 * returns: ecommerce/menu/xy1234abc
 */
export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return null;

  // Extract path after '/upload/'
  let path = url.substring(uploadIndex + 8);

  // If path starts with version (e.g. 'v1234567/'), strip it
  if (path.startsWith('v')) {
    const nextSlash = path.indexOf('/');
    if (nextSlash !== -1) {
      // Check if it's followed by numbers (standard Cloudinary version format)
      const potentialVersion = path.substring(1, nextSlash);
      if (/^\d+$/.test(potentialVersion)) {
        path = path.substring(nextSlash + 1);
      }
    }
  }

  // Remove file extension
  const dotIndex = path.lastIndexOf('.');
  if (dotIndex !== -1) {
    path = path.substring(0, dotIndex);
  }

  return path;
};

/**
 * Deletes one or multiple files from Cloudinary using their URLs or public IDs.
 * @param {string|string[]} urlsOrPublicIds - Single URL/ID or an array of URLs/IDs
 */
export const deleteFromCloudinary = async (urlsOrPublicIds) => {
  try {
    if (!urlsOrPublicIds) return;

    const items = Array.isArray(urlsOrPublicIds) ? urlsOrPublicIds : [urlsOrPublicIds];
    
    for (const item of items) {
      if (!item) continue;

      // Determine if it's a URL or direct public_id
      const publicId = item.includes('res.cloudinary.com') ? extractPublicId(item) : item;

      if (publicId) {
        console.log(`Deleting from Cloudinary: ${publicId}`);
        await cloudinary.uploader.destroy(publicId);
      }
    }
  } catch (error) {
    console.error('Failed to delete file(s) from Cloudinary:', error);
  }
};
