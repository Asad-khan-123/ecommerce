import Cart from '../models/cart.js';

// Get user cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('getCart Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cart items' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, size, color, quantity } = req.body;
    if (!productId || !size || !color) {
      return res.status(400).json({ success: false, message: 'Product, size, and color selection are required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    const qtyToAdd = quantity ? Number(quantity) : 1;

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += qtyToAdd;
    } else {
      cart.items.push({ product: productId, size, color, quantity: qtyToAdd });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    console.error('addToCart Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add item to cart' });
  }
};

// Update item quantity in cart
export const updateQuantity = async (req, res) => {
  try {
    const { productId, size, color, quantity } = req.body;
    if (!productId || !size || !color || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product details and quantity are required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item variant not found in cart' });
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    console.error('updateQuantity Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update item quantity' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId, size, color } = req.body;
    if (!productId || !size || !color) {
      return res.status(400).json({ success: false, message: 'Product details are required' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    console.error('removeFromCart Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove item from cart' });
  }
};

// Clear all items in cart
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }
    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('clearCart Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
};
