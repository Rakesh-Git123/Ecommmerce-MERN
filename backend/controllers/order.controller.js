import Order from '../models/order.model.js';

// reate a new order
export const createOrder = async (req, res) => {
  const { name,phoneNo,email,items, shippingAddress, totalPrice, paymentMethod } = req.body;
  const userId = req.user._id;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const newOrder = new Order({
      user: userId,
      name,
      phoneNo,
      email,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all orders of the logged-in user
export const getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Get user orders error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get order by ID (user or admin)
export const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, order });
  } catch (err) {
    console.error('Get order by ID error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success:false, message:"Order Not found" });

    order.status = status;

    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Update order status error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Get all orders error:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
