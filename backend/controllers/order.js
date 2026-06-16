import Order from '../models/order.js';
import Cart from '../models/cart.js';

// ── Create a new order (user) ────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentId, paymentStatus, subtotal, shippingCost, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentId: paymentId || '',
      paymentStatus: paymentStatus || 'Pending',
      subtotal: subtotal || totalPrice,
      shippingCost: shippingCost || 0,
      totalPrice
    });

    // If paid via cart checkout, clear the user's cart
    if (paymentStatus === 'Paid' && req.body.clearCart) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'title slug images');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('createOrder Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

// ── Get logged-in user's orders ──────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title slug images')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('getMyOrders Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// ── Get single order details ─────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title slug images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow only the owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('getOrderById Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// ── Admin: Get all orders ────────────────────────────────────────────────────
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email avatar')
      .populate('items.product', 'title slug images')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('getAllOrdersAdmin Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// ── Admin: Update order delivery status ─────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('items.product', 'title slug images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('updateOrderStatus Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

// ── Admin: Update payment status ─────────────────────────────────────────────
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ['Pending', 'Paid', 'Failed'];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('items.product', 'title slug images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('updatePaymentStatus Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
};
