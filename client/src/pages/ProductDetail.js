import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../state/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    const run = async () => {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    };
    run();
  }, [id]);

  if (!product) return <p>Đang tải...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={product.image || '/placeholder.svg'} alt={product.name} className="w-full h-80 object-cover rounded" />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-brand text-xl font-semibold mt-2">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</p>
        <p className="mt-3 text-sm text-gray-700">{product.description}</p>
        <p className="mt-2 text-sm">Tồn kho: {product.stock}</p>
        <div className="mt-4 flex items-center gap-2">
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))}
                 className="border rounded px-3 py-2 w-24" />
          <button className="bg-brand text-white px-4 py-2 rounded" onClick={() => add(product, qty)}>Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  );
}