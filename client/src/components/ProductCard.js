import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../state/WishlistContext';
import { FiHeart } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const wished = has(product._id);
  return (
    <div className="relative bg-white rounded shadow hover:shadow-md transition">
      <button aria-label="Yêu thích" onClick={() => toggle(product)}
              className={`absolute top-2 right-2 z-10 p-2 rounded-full border ${wished ? 'bg-red-100 border-red-300' : 'bg-white border-gray-200'}`}>
        <FiHeart className={wished ? 'text-red-600' : 'text-gray-600'} />
      </button>
      <Link to={`/products/${product._id}`} className="block">
        <img src={product.image || '/placeholder.svg'} alt={product.name} className="w-full h-40 object-cover rounded-t" />
        <div className="p-3">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-brand font-bold mt-1">{new Intl.NumberFormat('vi-VN').format(product.price)} đ</p>
        </div>
      </Link>
    </div>
  );
}