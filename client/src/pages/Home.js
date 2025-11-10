import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const categories = ['Tivi', 'Tủ lạnh', 'Laptop', 'Điện thoại', 'Gia dụng', 'Phụ kiện'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await api.get('/products', { params: { limit: 12 } });
      setProducts(res.data.items);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div>
      <section className="bg-brand text-white rounded p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Mua sắm điện tử & gia dụng giá tốt</h1>
        <p className="mt-2">Hàng chính hãng, bảo hành đầy đủ, giao nhanh toàn quốc.</p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {categories.map((c) => (
          <button key={c} onClick={() => navigate(`/products?category=${encodeURIComponent(c)}`)}
                  className="bg-white border rounded px-3 py-2 hover:border-brand">
            {c}
          </button>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Sản phẩm mới</h2>
          <Link to="/products" className="text-brand">Xem tất cả</Link>
        </div>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}