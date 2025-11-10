import React, { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { useCart } from '../state/CartContext';
import api from '../utils/api';

export default function Checkout() {
  const { user } = useAuth();
  const { items, clear, total } = useCart();
  const [email, setEmail] = useState(user?.email || '');
  const [status, setStatus] = useState('idle');
  const [msg, setMsg] = useState('');

  const placeOrder = async () => {
    try {
      setStatus('loading');
      const payload = { items: items.map((it) => ({ productId: it._id, quantity: it.quantity })), email };
      const res = await api.post('/orders', payload);
      clear();
      setStatus('success');
      setMsg(`Đặt hàng thành công. Mã đơn: ${res.data._id}`);
    } catch (err) {
      setStatus('error');
      setMsg(err.response?.data?.message || err.message);
    }
  };

  if (!user) return <p>Vui lòng đăng nhập để thanh toán.</p>;
  if (items.length === 0) return <p>Giỏ hàng trống.</p>;

  return (
    <div className="max-w-xl mx-auto bg-white border rounded p-4">
      <h1 className="text-xl font-semibold mb-3">Thanh toán</h1>
      <p>Tổng tiền: <span className="text-brand font-bold">{new Intl.NumberFormat('vi-VN').format(total)} đ</span></p>
      <label className="block mt-3 text-sm">Email nhận xác nhận</label>
      <input className="border rounded px-3 py-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2 rounded mt-4" onClick={placeOrder} disabled={status==='loading'}>
        {status==='loading' ? 'Đang xử lý...' : 'Đặt hàng'}
      </button>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}