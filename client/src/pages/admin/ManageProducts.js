import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', price: 0, stock: 0, description: '' });
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await api.get('/products', { params: { limit: 100 } });
    setItems(res.data.items);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    if (editing) {
      await api.put(`/products/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    setForm({ name: '', category: '', price: 0, stock: 0, description: '' });
    setImage(null);
    setEditing(null);
    await load();
  };

  const edit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description });
  };
  const del = async (id) => { await api.delete(`/products/${id}`); await load(); };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-3">Thêm / Sửa sản phẩm</h2>
        <form onSubmit={submit} className="space-y-2">
          <input className="border rounded px-3 py-2 w-full" placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2 w-full" placeholder="Danh mục" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input type="number" className="border rounded px-3 py-2 w-full" placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <input type="number" className="border rounded px-3 py-2 w-full" placeholder="Tồn kho" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <textarea className="border rounded px-3 py-2 w-full" placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <button className="bg-brand text-white px-4 py-2 rounded" type="submit">{editing ? 'Cập nhật' : 'Thêm mới'}</button>
          {editing && <button type="button" className="ml-2 px-4 py-2 rounded border" onClick={() => setEditing(null)}>Huỷ</button>}
        </form>
      </div>
      <div>
        <h2 className="font-semibold mb-3">Danh sách sản phẩm</h2>
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p._id} className="flex items-center gap-3 bg-white border rounded p-3">
              <img src={p.image || '/placeholder.svg'} alt={p.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">{p.name}</p>
                <p>{p.category} • {new Intl.NumberFormat('vi-VN').format(p.price)} đ • tồn {p.stock}</p>
              </div>
              <button className="text-brand" onClick={() => edit(p)}>Sửa</button>
              <button className="text-red-600" onClick={() => del(p._id)}>Xóa</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}