import React, { useEffect, useState } from 'react';
import { useAuth } from '../state/AuthContext';

export default function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/orders/mine', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Không thể tải đơn hàng');
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchOrders();
  }, [token]);

  if (!token) return <p>Vui lòng đăng nhập để xem đơn hàng của bạn.</p>;
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Đơn của tôi</h1>
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border rounded p-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Mã đơn: {o._id}</p>
                  <p>Trạng thái: {o.status}</p>
                  <p>Tổng tiền: {new Intl.NumberFormat('vi-VN').format(o.totalPrice)} đ</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{new Date(o.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <div className="mt-2 text-sm">
                Sản phẩm:
                <ul className="list-disc ml-5">
                  {o.items?.map((it) => (
                    <li key={it.product?._id || it._id}>
                      {it.product?.name || it.name} x {it.quantity} — {new Intl.NumberFormat('vi-VN').format(it.price)} đ
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}