import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import ENV from '../utils/env.js';
import Setting from '../models/settings.js';

// ── Create a new order (user) ────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrators are not allowed to purchase products.' });
    }

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

// ── Lazy Initialize Razorpay Instance ─────────────────────────────────────────
let razorpayInstance;
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay API keys (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing in backend .env file.');
    }
    razorpayInstance = new Razorpay({
      key_id: ENV.RAZORPAY_KEY_ID,
      key_secret: ENV.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// ── Create a Razorpay Order (Secure server-side calculation) ─────────────────
export const createRazorpayOrder = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Administrators are not allowed to purchase products.' });
    }

    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay API keys (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing in backend .env file. Please add your real keys to backend/.env.'
      });
    }

    // Securely calculate amount on the server (do not trust user input)
    let calculatedSubtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }
      calculatedSubtotal += product.price * item.quantity;
    }

    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    const shippingFee = settingsMap.shippingFee ? parseFloat(settingsMap.shippingFee) : 150;
    const shippingThreshold = settingsMap.shippingThreshold ? parseFloat(settingsMap.shippingThreshold) : 2000;

    const calculatedShippingCost = calculatedSubtotal >= shippingThreshold ? 0 : shippingFee;
    const calculatedTotal = calculatedSubtotal + calculatedShippingCost;

    // Razorpay amount is in paise (INR * 100)
    const amountInPaise = Math.round(calculatedTotal * 100);

    const rzp = getRazorpayInstance();
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };

    const rzpOrder = await rzp.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: rzpOrder.id,
      keyId: ENV.RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      subtotal: calculatedSubtotal,
      shippingCost: calculatedShippingCost,
      totalPrice: calculatedTotal
    });
  } catch (error) {
    console.error('createRazorpayOrder Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to initialize payment order', error: error.message });
  }
};

// ── Verify Razorpay Payment Signature & Create DB Order ───────────────────────
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      clearCart
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment credentials are required for verification' });
    }

    // Verify signature using SHA256 HMAC
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    // Recalculate price on server to guarantee consistency and security
    let calculatedSubtotal = 0;
    const orderItemsToCreate = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }
      calculatedSubtotal += product.price * item.quantity;
      
      orderItemsToCreate.push({
        product: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '',
        size: item.size,
        color: item.color,
        quantity: item.quantity
      });
    }

    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    const shippingFee = settingsMap.shippingFee ? parseFloat(settingsMap.shippingFee) : 150;
    const shippingThreshold = settingsMap.shippingThreshold ? parseFloat(settingsMap.shippingThreshold) : 2000;

    const calculatedShippingCost = calculatedSubtotal >= shippingThreshold ? 0 : shippingFee;
    const calculatedTotal = calculatedSubtotal + calculatedShippingCost;

    // Create the confirmed paid order in the database
    const order = await Order.create({
      user: req.user._id,
      items: orderItemsToCreate,
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      paymentId: razorpay_payment_id,
      subtotal: calculatedSubtotal,
      shippingCost: calculatedShippingCost,
      totalPrice: calculatedTotal
    });

    // Clear cart if requested
    if (clearCart) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    }

    const populated = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product', 'title slug images');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('verifyRazorpayPayment Error:', error);
    return res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};

// ── Delete Order (Admin only) ──────────────────────────────────────────────────
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('deleteOrder Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
  }
};
