#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  sudo ./deploy-ubuntu.sh \
#    -d your-domain-or-ip \
#    -w /var/www/commerce1 \
#    -a /srv/commerce/api \
#    -m "mongodb://127.0.0.1:27017/dienmay" \
#    -s "your-strong-jwt-secret"

DOMAIN=""
WEB_ROOT=""
API_DIR=""
MONGODB_URI=""
JWT_SECRET=""

while getopts ":d:w:a:m:s:" opt; do
  case $opt in
    d) DOMAIN="$OPTARG" ;;
    w) WEB_ROOT="$OPTARG" ;;
    a) API_DIR="$OPTARG" ;;
    m) MONGODB_URI="$OPTARG" ;;
    s) JWT_SECRET="$OPTARG" ;;
    :) echo "Missing value for -$OPTARG"; exit 1 ;;
    \?) echo "Unknown option -$OPTARG"; exit 1 ;;
  esac
done

if [[ -z "$DOMAIN" || -z "$WEB_ROOT" || -z "$API_DIR" || -z "$MONGODB_URI" || -z "$JWT_SECRET" ]]; then
  echo "Usage: $0 -d DOMAIN -w WEB_ROOT -a API_DIR -m MONGODB_URI -s JWT_SECRET"
  exit 1
fi

echo "[1/6] Installing system packages (Node.js 18, pm2, nginx)"
apt-get update -y
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi
npm i -g pm2
apt-get install -y nginx

echo "[2/6] Prepare web root: $WEB_ROOT"
mkdir -p "$WEB_ROOT"
chown -R www-data:www-data "$WEB_ROOT"

echo "[3/6] Configure API service in $API_DIR"
mkdir -p "$API_DIR/uploads"
cd "$API_DIR"
npm install

echo "[3.1] Start API with PM2"
export MONGODB_URI="$MONGODB_URI"
export JWT_SECRET="$JWT_SECRET"
pm2 start index.js --name dienmay-api || pm2 restart dienmay-api
pm2 save
pm2 startup | tail -n +1 || true

echo "[4/6] Configure Nginx site for $DOMAIN"
SITE_FILE="/etc/nginx/sites-available/dienmay"
cat > "$SITE_FILE" <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    root $WEB_ROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:3000/uploads/;
    }
}
EOF

ln -sf "$SITE_FILE" /etc/nginx/sites-enabled/dienmay
nginx -t
systemctl reload nginx

echo "[5/6] Point frontend API_BASE to http://$DOMAIN"
if [[ -f "$WEB_ROOT/assets/api.js" ]]; then
  sed -i "s|^const API_BASE = .*|const API_BASE = 'http://$DOMAIN';|" "$WEB_ROOT/assets/api.js" || true
fi

echo "[6/6] Done"
echo "Web:  http://$DOMAIN/"
echo "API:  http://$DOMAIN/api/products"
echo "Admin: http://$DOMAIN/admin/login.html"

