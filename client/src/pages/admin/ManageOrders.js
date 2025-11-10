import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const statuses = ['Pending', 'Shipping', 'Delivered', 'Cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    await load();
  };

  return (
    <div>
      <h2 className="font-semibold mb-3">Quản lý đơn hàng</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white border rounded p-3">
            <p className="font-semibold">#{o._id} • {o.user?.name} ({o.user?.email})</p>
            <p>Tổng: {new Intl.NumberFormat('vi-VN').format(o.total)} đ</p>
            <p className="mt-1">Trạng thái: <span className="font-semibold">{o.status}</span></p>
            <div className="mt-2 flex gap-2">
              {statuses.map((s) => (
                <button key={s} className="px-3 py-1 border rounded" onClick={() => changeStatus(o._id, s)}>{s}</button>
              ))}
            </div>
            <div className="mt-2 text-sm">{o.items.map((it) => `${it.name} x${it.quantity}`).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}