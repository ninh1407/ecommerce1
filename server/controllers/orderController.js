import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity } | or { productId, name, price, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items' });
    }
    const populated = await Promise.all(
      items.map(async (it) => {
        const prod = await Product.findById(it.productId);
        if (!prod) throw new Error('Product not found');
        return {
          productId: prod._id,
          name: prod.name,
          price: prod.price,
          quantity: it.quantity,
        };
      })
    );
    const total = populated.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const order = await Order.create({ user: req.user.id, items: populated, total, status: 'Pending' });

    // send email (best effort)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.body.email || process.env.EMAIL_USER,
        subject: `Xác nhận đơn hàng #${order._id}`,
        html: `<h3>Cảm ơn bạn đã đặt hàng!</h3>
               <p>Mã đơn hàng: ${order._id}</p>
               <p>Tổng tiền: ${total.toLocaleString('vi-VN')} VND</p>`,
      });
    } catch (mailErr) {
      console.warn('Email error:', mailErr.message);
    }

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Not found' });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};