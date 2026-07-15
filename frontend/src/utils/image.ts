/**
 * Automatically appends f_auto,q_auto to Cloudinary image URLs
 * to serve compressed AVIF/WebP images depending on browser support.
 */
export const optimizeCloudinaryUrl = (url: string): string => {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Check if it already has transformations applied
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url;
  }

  // Insert f_auto,q_auto right after /upload/
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
};
