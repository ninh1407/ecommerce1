import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded p-4">
      <h1 className="text-xl font-semibold mb-3">Đăng nhập</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="border rounded px-3 py-2 w-full" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-brand text-white px-4 py-2 rounded w-full" type="submit">Đăng nhập</button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-sm">Chưa có tài khoản? <Link to="/register" className="text-brand">Đăng ký</Link></p>
    </div>
  );
}