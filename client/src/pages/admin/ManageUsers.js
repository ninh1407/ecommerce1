import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (u, role) => {
    await api.put(`/users/${u._id}`, { role });
    await load();
  };
  const del = async (id) => { await api.delete(`/users/${id}`); await load(); };

  return (
    <div>
      <h2 className="font-semibold mb-3">Quản lý người dùng</h2>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u._id} className="bg-white border rounded p-3 flex items-center">
            <div className="flex-1">
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm">{u.email} • role: {u.role}</p>
            </div>
            <button className="px-3 py-1 border rounded mr-2" onClick={() => changeRole(u, u.role === 'admin' ? 'user' : 'admin')}>{u.role === 'admin' ? 'Set user' : 'Set admin'}</button>
            <button className="px-3 py-1 border rounded text-red-600" onClick={() => del(u._id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}