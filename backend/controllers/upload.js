export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = req.file.path || req.file.secure_url;
    const publicId = req.file.filename || req.file.public_id;

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary upload failed - no URL returned'
      });
    }

    res.status(200).json({
      success: true,
      imageUrl,
      publicId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};
