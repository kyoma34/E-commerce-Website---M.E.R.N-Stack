import Order   from '../models/Order.js';
import Product from '../models/Product.js';

// ── POST /api/orders ─────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'No order items' });

    // ── validate stock & decrement ───────────────────────
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.name}` });

      if (product.state === 'Out of stock' || (product.stock != null && product.stock < item.quantity))
        return res.status(400).json({ message: `"${product.name}" is out of stock` });

      // decrement stock
      if (product.stock != null) {
        product.stock = Math.max(0, product.stock - item.quantity);
        if (product.stock === 0) product.state = 'Out of stock';
        await product.save();
      }
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// ── GET /api/orders/mine ─────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getMyOrders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ── GET /api/orders  (admin) ─────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// ── PUT /api/orders/:id/status  (admin) ──────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!valid.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // if cancelling — restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product && product.stock != null) {
          product.stock += item.quantity;
          if (product.stock > 0 && product.state === 'Out of stock')
            product.state = 'Active';
          await product.save();
        }
      }
    }

    order.status = status;
    if (status === 'Delivered') { order.isPaid = true; order.paidAt = Date.now(); }

    const updated = await order.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// ── GET /api/orders/:id ──────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.product', 'name image');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin)
      return res.status(403).json({ message: 'Not authorized' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};