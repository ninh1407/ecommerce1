import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';

export default function Cart() {
  const { items, update, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Giỏ hàng</h1>
      {items.length === 0 ? (
        <p>Giỏ hàng trống. <Link to="/products" className="text-brand">Mua sắm ngay</Link></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map((it) => (
              <div key={it._id} className="flex items-center gap-3 bg-white border rounded p-3">
                <img src={it.image || '/placeholder.svg'} alt={it.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{it.name}</p>
                  <p>{new Intl.NumberFormat('vi-VN').format(it.price)} đ</p>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" min={1} value={it.quantity} onChange={(e) => update(it._id, Number(e.target.value))}
                           className="border rounded w-20 px-2 py-1" />
                    <button className="text-red-600" onClick={() => remove(it._id)}>Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border rounded p-4">
            <p className="font-semibold mb-2">Tổng tiền</p>
            <p className="text-brand text-xl font-bold">{new Intl.NumberFormat('vi-VN').format(total)} đ</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded mt-4 w-full" onClick={() => navigate('/checkout')}>Đặt hàng</button>
          </div>
        </div>
      )}
    </div>
  );
}