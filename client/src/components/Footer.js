import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Gia Dụng Store. All rights reserved.</p>
      </div>
    </footer>
  );
}