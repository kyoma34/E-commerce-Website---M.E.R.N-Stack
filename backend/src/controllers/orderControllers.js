import Order from '../models/Order.js';

// ── POST /api/orders  (logged-in user) ───────────────────
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: 'No order items' });

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

// ── GET /api/orders/mine  (logged-in user) ───────────────
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

// ── GET /api/orders  (admin only) ────────────────────────
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

// ── PUT /api/orders/:id/status  (admin only) ─────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'Delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updated = await order.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// ── GET /api/orders/:id  (admin or order owner) ──────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('orderItems.product', 'name image');

    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    // allow admin or the order's owner
    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin)
      return res.status(403).json({ message: 'Not authorized' });

    res.status(200).json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};