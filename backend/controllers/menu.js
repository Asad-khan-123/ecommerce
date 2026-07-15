import MenuItem from '../models/menuItem.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ isActive: true })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu items', error: error.message });
  }
};

export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching menu items', error: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { title, slug } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and slug are required' });
    }

    const existingItem = await MenuItem.findOne({ slug });
    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }

    const menuItem = new MenuItem({
      title,
      slug,
      order: req.body.order || 0,
      isActive: req.body.isActive !== false,
      columns: req.body.columns || [],
      images: req.body.images || []
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating menu item', error: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, order, isActive, columns, images } = req.body;

    console.log('Update menu item request:', { id, title, slug, columns: columns?.length, images: images?.length });

    let menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    if (slug && slug !== menuItem.slug) {
      const existingItem = await MenuItem.findOne({ slug });
      if (existingItem) {
        return res.status(400).json({ success: false, message: 'Slug already exists' });
      }
    }

    menuItem.title = title || menuItem.title;
    menuItem.slug = slug || menuItem.slug;
    menuItem.order = order !== undefined ? order : menuItem.order;
    menuItem.isActive = isActive !== undefined ? isActive : menuItem.isActive;
    menuItem.columns = columns !== undefined ? columns : menuItem.columns;
    
    if (images !== undefined) {
      const oldImageUrls = menuItem.images?.map(img => img.imageUrl).filter(Boolean) || [];
      const newImageUrls = images?.map(img => img.imageUrl).filter(Boolean) || [];
      const removedImageUrls = oldImageUrls.filter(url => !newImageUrls.includes(url));
      
      if (removedImageUrls.length > 0) {
        await deleteFromCloudinary(removedImageUrls);
      }
      menuItem.images = images;
    }
    
    menuItem.updatedAt = Date.now();

    await menuItem.save();

    console.log('Menu item saved successfully:', { id, columns: menuItem.columns?.length });

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Menu item update error:', error);
    res.status(500).json({ success: false, message: 'Error updating menu item', error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Delete associated images from Cloudinary
    const imageUrls = menuItem.images?.map(img => img.imageUrl).filter(Boolean) || [];
    if (imageUrls.length > 0) {
      await deleteFromCloudinary(imageUrls);
    }

    await MenuItem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting menu item', error: error.message });
  }
};

export const reorderMenuItems = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    for (const item of items) {
      await MenuItem.findByIdAndUpdate(item.id, { order: item.order });
    }

    const updatedItems = await MenuItem.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: updatedItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reordering items', error: error.message });
  }
};
