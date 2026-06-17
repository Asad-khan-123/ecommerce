import express from 'express';
import Product from '../models/product.js';
import MenuItem from '../models/menuItem.js';

const router = express.Router();

// GET /api/collections/:menuSlug - Get all products from a menu
router.get('/:menuSlug', async (req, res) => {
  try {
    const { menuSlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Find the menu item by slug
    const menuItem = await MenuItem.findOne({ slug: menuSlug, isActive: true });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Get products for this menu item with pagination
    const products = await Product.find({
      menuItem: menuItem._id,
      isActive: true
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Product.countDocuments({
      menuItem: menuItem._id,
      isActive: true
    });

    res.json({
      success: true,
      products,
      pageTitle: menuItem.title,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        limit
      },
      total
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection',
      error: error.message
    });
  }
});

// GET /api/collections/:menuSlug/:itemSlug - Get products from specific submenu item
router.get('/:menuSlug/:itemSlug', async (req, res) => {
  try {
    const { menuSlug, itemSlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    console.log('Fetching submenu products:', { menuSlug, itemSlug });

    // Find the menu item by slug
    const menuItem = await MenuItem.findOne({ slug: menuSlug, isActive: true });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    console.log('Found menu item:', menuItem.title, menuItem._id);

    // Get products for this specific submenu item with pagination
    // Match using subMenuItemId which should be the itemSlug
    const products = await Product.find({
      menuItem: menuItem._id,
      subMenuItemId: itemSlug,
      isActive: true
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log('Found products:', products.length);

    // Get total count for pagination
    const total = await Product.countDocuments({
      menuItem: menuItem._id,
      subMenuItemId: itemSlug,
      isActive: true
    });

    // Find the submenu item label from menu columns
    let submenuLabel = itemSlug;
    if (menuItem.columns) {
      for (const column of menuItem.columns) {
        const item = column.items?.find(i => {
          // Extract slug from link (e.g., "/shop/flora" -> "flora")
          const linkParts = i.link?.split('/').filter(Boolean);
          const linkSlug = linkParts?.[linkParts.length - 1];
          return linkSlug === itemSlug;
        });
        if (item) {
          submenuLabel = item.label;
          break;
        }
      }
    }

    res.json({
      success: true,
      products,
      pageTitle: `${menuItem.title} - ${submenuLabel}`,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        limit
      },
      total
    });
  } catch (error) {
    console.error('Error fetching submenu collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection',
      error: error.message
    });
  }
});

export default router;
