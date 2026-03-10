#!/bin/bash

# ContractorPro 服务器初始化脚本
# 在服务器上运行: bash setup-server.sh

set -e

echo "🚀 开始配置服务器..."

# 1. 更新系统
echo "📦 更新系统..."
apt update && apt upgrade -y

# 2. 安装 Nginx
echo "🌐 安装 Nginx..."
apt install nginx -y

# 3. 创建项目目录
echo "📁 创建项目目录..."
mkdir -p /var/www/contractorpro

# 4. 创建 Nginx 配置
echo "⚙️ 配置 Nginx..."
cat > /etc/nginx/sites-available/contractorpro << 'EOF'
server {
    listen 80;
    server_name contractorpro.maxwelllai.com;

    root /var/www/contractorpro;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
}
EOF

# 5. 启用站点
echo "🔗 启用站点..."
ln -sf /etc/nginx/sites-available/contractorpro /etc/nginx/sites-enabled/

# 6. 测试 Nginx 配置
echo "🧪 测试 Nginx 配置..."
nginx -t

# 7. 重启 Nginx
echo "🔄 重启 Nginx..."
systemctl restart nginx
systemctl enable nginx

# 8. 安装 Certbot (SSL)
echo "🔒 安装 Certbot..."
apt install certbot python3-certbot-nginx -y

echo ""
echo "✅ 服务器配置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 上传网站文件到 /var/www/contractorpro/"
echo "2. 运行 SSL 配置: sudo certbot --nginx -d contractorpro.maxwelllai.com"
echo ""