# Ecommerce (Electronics & Home Appliances)

Một website bán hàng điện tử gia dụng hoàn chỉnh gồm backend (Node.js/Express/MongoDB) và frontend (React/TailwindCSS). Dự án sẵn sàng build, deploy và chạy thực tế trên Ubuntu với Nginx reverse proxy.

## Kiến trúc

- Backend: Node.js + Express + MongoDB (Mongoose), chạy port `5000`
- Frontend: React + TailwindCSS, build ra thư mục `client/build`, chạy dev port `3000`
- Thư mục upload ảnh sản phẩm: `server/uploads/products`

## Cấu trúc thư mục

```
ecommerce/
├── server/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── uploads/products/
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
└── README.md
```

## .env (server/.env.example)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=secret123
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
```

## Hướng dẫn deploy trên Ubuntu (20.205.30.184)

Lưu ý: Hãy thay thế `yourname`/repo nếu bạn tự tạo repository. Hoặc upload mã nguồn lên máy chủ rồi làm theo các bước dưới.

```bash
# Cập nhật và cài đặt phụ thuộc
sudo apt update && sudo apt install nginx git nodejs npm mongodb -y
sudo npm install pm2 -g

# Lấy mã nguồn (ví dụ từ GitHub)
git clone https://github.com/yourname/ecommerce.git
cd ecommerce/server
cp .env.example .env
npm install
pm2 start app.js --name ecommerce-backend

# Build frontend
cd ../client
npm install
npm run build

# Cấu hình Nginx (ví dụ)
sudo tee /etc/nginx/sites-available/ecommerce > /dev/null <<'CONF'
server {
    listen 80;
    server_name 20.205.30.184;

    location / {
        root /root/ecommerce/client/build;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
CONF

sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# (Tuỳ chọn) Cài SSL bằng certbot
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

## Ghi chú

- Gmail có thể cần cấu hình App Password (nếu bật 2FA). Trường hợp gửi email lỗi, hệ thống vẫn tạo đơn hàng, nhưng log cảnh báo.
- Thư mục `server/uploads/products` dùng để lưu ảnh. Nginx/Express phục vụ tĩnh qua `/uploads`.
- Frontend sử dụng REST API qua base URL `/api` (được reverse proxy bởi Nginx).

## Scripts nhanh (local dev)

- Backend: `cd server && npm install && npm run dev`
- Frontend: `cd client && npm install && npm start`

## Tài khoản

- Khi đăng ký người dùng đầu tiên, có thể chỉnh role thành `admin` bằng API quản trị (hoặc cập nhật thẳng DB). Trong UI Admin có thể đổi role người dùng.