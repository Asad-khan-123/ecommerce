import Product from '../models/product.js';
import Setting from '../models/settings.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

// Helper to generate a slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric chars except space and hyphen
    .replace(/[\s_]+/g, '-')     // replace spaces and underscores with hyphens
    .replace(/-+/g, '-')         // remove multiple consecutive hyphens
    .replace(/^-+|-+$/g, '');     // trim leading/trailing hyphens
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Product title is required' });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ success: false, message: 'Product price is required' });
    }

    let slug = req.body.slug ? generateSlug(req.body.slug) : generateSlug(title);

    // Ensure unique slug
    let existingProduct = await Product.findOne({ slug });
    let counter = 1;
    let baseSlug = slug;
    while (existingProduct) {
      slug = `${baseSlug}-${counter}`;
      existingProduct = await Product.findOne({ slug });
      counter++;
    }

    const product = new Product({
      title,
      slug,
      description: req.body.description || '',
      price,
      compareAtPrice: req.body.compareAtPrice,
      images: req.body.images || [],
      sizes: req.body.sizes || [],
      colors: req.body.colors || [],
      inStock: req.body.inStock !== false,
      inventory: req.body.inventory || 0,
      menuItem: req.body.menuItem || null,
      columnId: req.body.columnId || null,
      subMenuItemId: req.body.subMenuItemId || null,
      tag: req.body.tag || null,
      isActive: req.body.isActive !== false,
      fabricMaterials: req.body.fabricMaterials || '',
      sizeModel: req.body.sizeModel || '',
      fitConstruction: req.body.fitConstruction || '',
      shippingReturns: req.body.shippingReturns || ''
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

// Get active products for storefront (with optional filters)
export const getProducts = async (req, res) => {
  try {
    const query = { isActive: true };

    const { menuItem, columnId, subMenuItemId, limit = 20, page = 1, search } = req.query;

    if (menuItem) query.menuItem = menuItem;
    if (columnId) query.columnId = columnId;
    if (subMenuItemId) query.subMenuItemId = subMenuItemId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate('menuItem', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};

// Get all products for admin dashboard (unfiltered, no pagination for simplicity or with details)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('menuItem', 'title slug')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};

// Get single product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate('menuItem', 'title slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch settings to resolve defaults
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    const resolvedProduct = product.toObject();

    // Resolve accordion tabs: if empty, use settings defaults, else fallback to hardcoded initial values
    resolvedProduct.fabricMaterials = product.fabricMaterials || settingsMap["fabricMaterials"] || "Crafted from premium quality materials selected for durability and comfort. Each piece undergoes rigorous quality checks before reaching you.";
    resolvedProduct.sizeModel = product.sizeModel || settingsMap["sizeModel"] || "Our model is 6'1\" and wearing a size M. The fit is true to size — we recommend ordering your usual size.";
    resolvedProduct.fitConstruction = product.fitConstruction || settingsMap["fitConstruction"] || "Relaxed fit with structured shoulders for a clean silhouette. Designed to layer or wear standalone.";
    resolvedProduct.shippingReturns = product.shippingReturns || settingsMap["shippingReturns"] || "Free shipping on orders over ₹2,000. Rs. 150 shipping fee otherwise. Returns accepted within 14 days of delivery in original condition.";

    res.status(200).json({
      success: true,
      data: resolvedProduct
    });
  } catch (error) {
    res.status(550).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (title) {
      product.title = title;
      // If title is changing and user hasn't explicitly supplied a slug, generate a new one
      if (!req.body.slug) {
        let newSlug = generateSlug(title);
        if (newSlug !== product.slug) {
          let existingProduct = await Product.findOne({ slug: newSlug });
          let counter = 1;
          let baseSlug = newSlug;
          while (existingProduct && existingProduct._id.toString() !== id) {
            newSlug = `${baseSlug}-${counter}`;
            existingProduct = await Product.findOne({ slug: newSlug });
            counter++;
          }
          product.slug = newSlug;
        }
      }
    }

    if (req.body.slug) {
      let requestedSlug = generateSlug(req.body.slug);
      if (requestedSlug !== product.slug) {
        let existingProduct = await Product.findOne({ slug: requestedSlug });
        let counter = 1;
        let baseSlug = requestedSlug;
        while (existingProduct && existingProduct._id.toString() !== id) {
          requestedSlug = `${baseSlug}-${counter}`;
          existingProduct = await Product.findOne({ slug: requestedSlug });
          counter++;
        }
        product.slug = requestedSlug;
      }
    }

    if (price !== undefined) product.price = price;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.compareAtPrice !== undefined) product.compareAtPrice = req.body.compareAtPrice;
    
    if (req.body.images !== undefined) {
      const oldImages = product.images || [];
      const newImages = req.body.images || [];
      const removedImages = oldImages.filter(img => !newImages.includes(img));
      if (removedImages.length > 0) {
        await deleteFromCloudinary(removedImages);
      }
      product.images = newImages;
    }
    if (req.body.sizes !== undefined) product.sizes = req.body.sizes;
    if (req.body.colors !== undefined) product.colors = req.body.colors;
    if (req.body.inStock !== undefined) product.inStock = req.body.inStock;
    if (req.body.inventory !== undefined) product.inventory = req.body.inventory;
    
    // Categorization
    if (req.body.menuItem !== undefined) product.menuItem = req.body.menuItem;
    if (req.body.columnId !== undefined) product.columnId = req.body.columnId;
    if (req.body.subMenuItemId !== undefined) product.subMenuItemId = req.body.subMenuItemId;
    
    if (req.body.tag !== undefined) product.tag = req.body.tag;
    if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

    if (req.body.fabricMaterials !== undefined) product.fabricMaterials = req.body.fabricMaterials;
    if (req.body.sizeModel !== undefined) product.sizeModel = req.body.sizeModel;
    if (req.body.fitConstruction !== undefined) product.fitConstruction = req.body.fitConstruction;
    if (req.body.shippingReturns !== undefined) product.shippingReturns = req.body.shippingReturns;

    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      await deleteFromCloudinary(product.images);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

// Create or update a product review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rating between 1 and 5' });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a comment' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      alreadyReviewed.rating = parsedRating;
      alreadyReviewed.comment = comment.trim();
      alreadyReviewed.name = req.user.name;
    } else {
      const review = {
        name: req.user.name,
        rating: parsedRating,
        comment: comment.trim(),
        user: req.user._id
      };
      product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;
    // Calculate new overall rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: alreadyReviewed ? 'Review updated' : 'Review added',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding review', error: error.message });
  }
};
