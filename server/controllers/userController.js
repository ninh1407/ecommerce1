import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const payload = { name, email, role };
    if (password) payload.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await user.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};