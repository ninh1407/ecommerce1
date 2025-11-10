import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../state/WishlistContext';

export default function Wishlist() {
  const { items, remove } = useWishlist();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Yêu thích</h1>
      {items.length === 0 ? (
        <p>Danh sách trống. <Link to="/products" className="text-brand">Khám phá sản phẩm</Link></p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <div key={p._id} className="bg-white border rounded">
              <Link to={`/products/${p._id}`}>
                <img src={p.image || '/placeholder.svg'} alt={p.name} className="w-full h-40 object-cover rounded-t" />
                <div className="p-3">
                  <p className="font-semibold line-clamp-1">{p.name}</p>
                  <p className="text-brand font-bold">{new Intl.NumberFormat('vi-VN').format(p.price)} đ</p>
                </div>
              </Link>
              <div className="p-3">
                <button className="text-red-600" onClick={() => remove(p._id)}>Xóa khỏi yêu thích</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}