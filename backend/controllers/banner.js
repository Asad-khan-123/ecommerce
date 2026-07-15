import Banner from '../models/banner.js';
import Highlight from '../models/highlight.js';
import Product from '../models/product.js';
import MenuItem from '../models/menuItem.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    // If setting active, deactivate others
    if (req.body.isActive) {
      await Banner.updateMany({}, { isActive: false });
    }
    const newBanner = new Banner(req.body);
    await newBanner.save();
    res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (req.body.isActive) {
      await Banner.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    // Clean up replaced images from Cloudinary
    const imagesToDelete = [];
    if (req.body.desktopImage && req.body.desktopImage !== banner.desktopImage) {
      imagesToDelete.push(banner.desktopImage);
    }
    if (req.body.mobileImage && req.body.mobileImage !== banner.mobileImage) {
      imagesToDelete.push(banner.mobileImage);
    }
    if (imagesToDelete.length > 0) {
      await deleteFromCloudinary(imagesToDelete);
    }

    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await deleteFromCloudinary([banner.desktopImage, banner.mobileImage]);
    }
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find().sort({ order: 1 });
    const resolvedHighlights = [];

    for (const hl of highlights) {
      const menuItem = await MenuItem.findById(hl.menuItem);
      if (!menuItem) continue;

      let subMenuItemLabel = '';
      let subMenuItemSlug = '';

      if (menuItem.columns) {
        const column = menuItem.columns.find(c => c._id.toString() === hl.columnId);
        if (column && column.items) {
          const item = column.items.find(i => {
            const linkParts = i.link?.split('/').filter(Boolean);
            const itemSlug = linkParts?.[linkParts.length - 1] || '';
            return itemSlug === hl.subMenuItemId;
          });
          if (item) {
            subMenuItemLabel = item.label;
            const linkParts = item.link?.split('/').filter(Boolean);
            subMenuItemSlug = linkParts?.[linkParts.length - 1] || item.label.toLowerCase().replace(/\s+/g, '-');
          }
        }
      }

      if (!subMenuItemLabel) {
        subMenuItemLabel = hl.subMenuItemId;
        subMenuItemSlug = hl.subMenuItemId.toLowerCase().replace(/\s+/g, '-');
      }

      const link = `/${menuItem.slug}/${subMenuItemSlug}`;

      // Find the first product added under this category
      const product = await Product.findOne({
        menuItem: hl.menuItem,
        subMenuItemId: hl.subMenuItemId,
        isActive: true
      }).sort({ createdAt: 1 });

      const imageUrl = product && product.images && product.images.length > 0
        ? product.images[0]
        : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=720&q=80';

      resolvedHighlights.push({
        _id: hl._id,
        menuItem: hl.menuItem,
        columnId: hl.columnId,
        subMenuItemId: hl.subMenuItemId,
        label: subMenuItemLabel,
        link,
        imageUrl
      });
    }

    res.status(200).json({ success: true, data: resolvedHighlights });
  } catch (error) {
    res.status(550).json({ success: false, message: error.message });
  }
};

export const saveHighlights = async (req, res) => {
  try {
    const { highlights } = req.body;

    if (!Array.isArray(highlights)) {
      return res.status(400).json({ success: false, message: 'Highlights must be an array' });
    }

    await Highlight.deleteMany({});

    const saved = [];
    for (let i = 0; i < Math.min(highlights.length, 4); i++) {
      const hl = new Highlight({
        menuItem: highlights[i].menuItem,
        columnId: highlights[i].columnId,
        subMenuItemId: highlights[i].subMenuItemId,
        order: i
      });
      await hl.save();
      saved.push(hl);
    }

    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
