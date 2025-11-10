import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const run = async () => {
      const [pr, or] = await Promise.all([
        api.get('/products', { params: { limit: 1 } }),
        api.get('/orders'),
      ]);
      const products = pr.data.total;
      const orders = or.data.length;
      const revenue = or.data.reduce((s, o) => s + (o.total || 0), 0);
      setStats({ products, orders, revenue });
    };
    run();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white border rounded p-4">
        <p className="text-sm">Sản phẩm</p>
        <p className="text-2xl font-bold">{stats.products}</p>
      </div>
      <div className="bg-white border rounded p-4">
        <p className="text-sm">Đơn hàng</p>
        <p className="text-2xl font-bold">{stats.orders}</p>
      </div>
      <div className="bg-white border rounded p-4">
        <p className="text-sm">Doanh thu</p>
        <p className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN').format(stats.revenue)} đ</p>
      </div>
    </div>
  );
}