import React from 'react';

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const prev = () => onPage(Math.max(1, page - 1));
  const next = () => onPage(Math.min(pages, page + 1));
  return (
    <div className="flex items-center justify-center space-x-3 mt-4">
      <button className="px-3 py-1 border rounded" onClick={prev} disabled={page === 1}>Prev</button>
      <span>Page {page}/{pages}</span>
      <button className="px-3 py-1 border rounded" onClick={next} disabled={page === pages}>Next</button>
    </div>
  );
}