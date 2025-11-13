function normalizeAddInfo(str) {
  const s = String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return s.replace(/[^A-Za-z0-9\s\-_.]/g, '').trim().slice(0, 25);
}

function toAmount(amount) {
  const n = Math.floor(Number(amount) || 0);
  return n > 0 ? n : 0;
}

function createVietQRLink(params) {
  const bankId = params.bankId;
  const accountNumber = params.accountNumber;
  const accountName = params.accountName || '';
  const amount = toAmount(params.amount);
  const orderCode = params.orderCode || '';
  const phone = params.phone || '';
  const template = params.template || 'compact';
  const media = params.media || '.jpg';
  const base = 'https://img.vietqr.io/image';
  const addInfo = normalizeAddInfo(`${orderCode} ${phone}`);
  const path = `${encodeURIComponent(bankId)}-${encodeURIComponent(accountNumber)}-${encodeURIComponent(template)}${media}`;
  const qs = `amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;
  return `${base}/${path}?${qs}`;
}

function createImageElement(params) {
  const img = new Image();
  img.alt = 'VietQR';
  img.loading = 'lazy';
  img.src = createVietQRLink(params);
  return img;
}

function renderVietQR(target, params) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;
  const img = createImageElement(params);
  el.innerHTML = '';
  el.appendChild(img);
  return img;
}

const vietqr = { createLink: createVietQRLink, render: renderVietQR, createImage: createImageElement };

if (typeof window !== 'undefined') {
  window.vietqr = vietqr;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = vietqr;
}

