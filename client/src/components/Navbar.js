import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { useCart } from '../state/CartContext';
import { FiShoppingCart } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-brand">Gia Dụng Store</Link>
        <nav className="space-x-4">
          <Link to="/products" className="hover:text-brand">Sản phẩm</Link>
          <Link to="/wishlist" className="hover:text-brand">Yêu thích</Link>
          <Link to="/cart" className="inline-flex items-center hover:text-brand">
            <FiShoppingCart className="mr-1" />
            <span>Giỏ hàng ({cartCount})</span>
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="hover:text-brand">Đơn của tôi</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-brand">Admin</Link>
              )}
              <button onClick={() => { logout(); navigate('/'); }} className="ml-2 text-red-600">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand">Đăng nhập</Link>
              <Link to="/register" className="hover:text-brand">Đăng ký</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}