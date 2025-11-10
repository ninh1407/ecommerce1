import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const page = Number(params.get('page') || 1);
  const [q, setQ] = useState(params.get('q') || '');
  const category = params.get('category') || '';
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [sort, setSort] = useState(params.get('sort') || 'newest');

  useEffect(() => {
    const run = async () => {
      const res = await api.get('/products', { params: { page, q, category, minPrice, maxPrice, sort, limit: 12 } });
      setItems(res.data.items);
      setTotal(res.data.total);
      setPages(res.data.pages);
    };
    run();
  }, [page, q, category, minPrice, maxPrice, sort]);

  const setPage = (p) => { params.set('page', String(p)); setParams(params, { replace: true }); };
  const onSearch = (e) => { e.preventDefault(); params.set('q', q || ''); params.set('page', '1'); setParams(params, { replace: true }); };
  const applyFilters = (e) => {
    e.preventDefault();
    if (minPrice) params.set('minPrice', String(minPrice)); else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', String(maxPrice)); else params.delete('maxPrice');
    params.set('sort', sort || 'newest');
    params.set('page', '1');
    setParams(params, { replace: true });
  };

  return (
    <div>
      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input className="border rounded px-3 py-2 flex-1" placeholder="Tìm kiếm sản phẩm" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="bg-brand text-white px-4 py-2 rounded" type="submit">Tìm</button>
      </form>

      <form onSubmit={applyFilters} className="grid md:grid-cols-4 gap-2 mb-4">
        <input type="number" min={0} className="border rounded px-3 py-2" placeholder="Giá từ"
               value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" min={0} className="border rounded px-3 py-2" placeholder="Giá đến"
               value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <select className="border rounded px-3 py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
        </select>
        <button className="bg-white border rounded px-3 py-2 hover:border-brand" type="submit">Áp dụng</button>
      </form>

      {category && <p className="mb-2">Danh mục: <span className="font-semibold">{category}</span></p>}
      {(minPrice || maxPrice) && (
        <p className="mb-2 text-sm text-gray-600">Giá: {minPrice ? `${Number(minPrice).toLocaleString('vi-VN')} đ` : '...'} - {maxPrice ? `${Number(maxPrice).toLocaleString('vi-VN')} đ` : '...'}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>

      <Pagination page={page} pages={pages} onPage={setPage} />
    </div>
  );
}