import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

export const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, q, minPrice, maxPrice, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    return res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : '';
    const item = await Product.create({ ...body, image: imagePath });
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const body = req.body;
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    let image = existing.image;
    if (req.file) {
      image = `/uploads/products/${req.file.filename}`;
      // optionally delete old file
      try {
        const oldPath = path.join(process.cwd(), 'ecommerce', 'server', existing.image);
        if (existing.image && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (_) {}
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, { ...body, image }, { new: true });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    await existing.deleteOne();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};