# ContractorPro 部署指南

## 服务器信息
- IP: 72.62.82.26
- 域名: contractorpro.maxwelllai.com
- 项目目录: /var/www/contractorpro

## 部署步骤

### 1. SSH 连接到服务器

```bash
ssh -i ~/.ssh/n8n root@72.62.82.26
```

### 2. 创建项目目录

```bash
mkdir -p /var/www/contractorpro
cd /var/www/contractorpro
```

### 3. 安装 Node.js (如果未安装)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. 克隆或上传项目代码

方式一：从本地上传
```bash
# 在本地执行
scp -i ~/.ssh/n8n -r ./* root@72.62.82.26:/var/www/contractorpro/
```

方式二：使用 Git
```bash
# 在服务器上执行
git clone <your-repo-url> /var/www/contractorpro
```

### 5. 安装依赖并构建

```bash
cd /var/www/contractorpro
npm install
npm run build
```

### 6. 安装 Nginx (如果未安装)

```bash
sudo apt update
sudo apt install nginx -y
```

### 7. 配置 Nginx

创建配置文件：
```bash
sudo nano /etc/nginx/sites-available/contractorpro
```

添加以下内容：
```nginx
server {
    listen 80;
    server_name contractorpro.maxwelllai.com;

    root /var/www/contractorpro/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/contractorpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. 配置 SSL (使用 Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d contractorpro.maxwelllai.com
```

### 9. 配置 DNS

在您的域名管理面板中添加 A 记录：
- 类型: A
- 名称: contractorpro
- 值: 72.62.82.26
- TTL: 3600

### 10. 验证部署

访问 https://contractorpro.maxwelllai.com 检查是否正常运行。

## 更新部署

当有代码更新时：

```bash
cd /var/www/contractorpro
# 如果使用 Git
git pull

# 或者从本地上传新文件
# scp -i ~/.ssh/n8n -r ./dist/* root@72.62.82.26:/var/www/contractorpro/dist/

npm install
npm run build
sudo systemctl reload nginx
```

## 常见问题

### 1. 页面刷新后 404
确保 Nginx 配置中有 `try_files $uri $uri/ /index.html;`

### 2. API 请求失败
Supabase Edge Functions 是独立部署的，不需要在服务器上配置。确保前端代码中的 Supabase URL 正确。

### 3. 查看 Nginx 日志
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log