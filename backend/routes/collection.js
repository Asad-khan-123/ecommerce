import express from 'express';
import Product from '../models/product.js';
import MenuItem from '../models/menuItem.js';

const router = express.Router();

// Helper to build dynamic query and sorting
const buildQueryAndSort = (menuItemId, itemSlug, queryParams) => {
  const query = {
    menuItem: menuItemId,
    isActive: true
  };

  if (itemSlug) {
    query.subMenuItemId = itemSlug;
  }

  // Size Filter
  if (queryParams.sizes) {
    const sizesArray = queryParams.sizes.split(',').map(s => s.trim()).filter(Boolean);
    if (sizesArray.length > 0) {
      query.sizes = { $in: sizesArray };
    }
  }

  // Color Filter
  if (queryParams.colors) {
    const colorsArray = queryParams.colors.split(',').map(c => c.trim()).filter(Boolean);
    if (colorsArray.length > 0) {
      query.colors = { $in: colorsArray };
    }
  }

  // Availability Filter
  if (queryParams.inStock) {
    query.inStock = queryParams.inStock === 'true';
  }

  // Price Filter
  if (queryParams.priceMin || queryParams.priceMax) {
    query.price = {};
    if (queryParams.priceMin) query.price.$gte = parseFloat(queryParams.priceMin);
    if (queryParams.priceMax) query.price.$lte = parseFloat(queryParams.priceMax);
  }

  // Sort Option
  let sortObj = { createdAt: -1 }; // default: newest / featured
  if (queryParams.sort) {
    if (queryParams.sort === 'price_asc') {
      sortObj = { price: 1 };
    } else if (queryParams.sort === 'price_desc') {
      sortObj = { price: -1 };
    } else if (queryParams.sort === 'newest') {
      sortObj = { createdAt: -1 };
    }
  }

  return { query, sortObj };
};

// GET /api/collections/:menuSlug - Get all products from a menu
router.get('/:menuSlug', async (req, res) => {
  try {
    const { menuSlug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Special case for 'products' (all products)
    if (menuSlug === 'products') {
      const query = { isActive: true };

      // Size Filter
      if (req.query.sizes) {
        const sizesArray = req.query.sizes.split(',').map(s => s.trim()).filter(Boolean);
        if (sizesArray.length > 0) {
          query.sizes = { $in: sizesArray };
        }
      }

      // Color Filter
      if (req.query.colors) {
        const colorsArray = req.query.colors.split(',').map(c => c.trim()).filter(Boolean);
        if (colorsArray.length > 0) {
          query.colors = { $in: colorsArray };
        }
      }

      // Availability Filter
      if (req.query.inStock) {
        query.inStock = req.query.inStock === 'true';
      }

      // Price Filter
      if (req.query.priceMin || req.query.priceMax) {
        query.price = {};
        if (req.query.priceMin) query.price.$gte = parseFloat(req.query.priceMin);
        if (req.query.priceMax) query.price.$lte = parseFloat(req.query.priceMax);
      }

      // Sort Option
      let sortObj = { createdAt: -1 };
      if (req.query.sort) {
        if (req.query.sort === 'price_asc') {
          sortObj = { price: 1 };
        } else if (req.query.sort === 'price_desc') {
          sortObj = { price: -1 };
        } else if (req.query.sort === 'newest') {
          sortObj = { createdAt: -1 };
        }
      }

      const products = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortObj);

      const total = await Product.countDocuments(query);

      return res.json({
        success: true,
        products,
        pageTitle: 'All Products',
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          limit
        },
        total
      });
    }

    // Find the menu item by slug
    const menuItem = await MenuItem.findOne({ slug: menuSlug, isActive: true });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    const { query, sortObj } = buildQueryAndSort(menuItem._id, null, req.query);

    // Get products for this menu item with pagination
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortObj);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

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

    const { query, sortObj } = buildQueryAndSort(menuItem._id, itemSlug, req.query);

    // Get products for this specific submenu item with pagination
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortObj);

    console.log('Found products:', products.length);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

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
