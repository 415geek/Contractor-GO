# ContractorPro 部署指南

## 服务器信息
- IP: 72.62.82.26
- 域名: contractorpro.maxwelllai.com
- 项目目录: /var/www/contractorpro

---

## 方式一：GitHub Actions 自动部署（推荐）

### 1. 创建 GitHub 仓库

```bash
# 在项目目录中初始化 Git
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库后
git remote add origin https://github.com/415geek/Contractor-Pro.git
git branch -M main
git push -u origin main
```

### 2. 配置 GitHub Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

| Secret Name | Value |
|-------------|-------|
| `SERVER_HOST` | `72.62.82.26` |
| `SERVER_USER` | `root` |
| `SSH_PRIVATE_KEY` | 您的 SSH 私钥内容（~/.ssh/n8n 的内容） |

获取 SSH 私钥：
```bash
cat ~/.ssh/n8n
```

### 3. 推送代码自动部署

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 构建项目
2. 上传到服务器
3. 重新加载 Nginx

---

## 方式二：手动部署

### 1. SSH 连接到服务器

```bash
ssh -i ~/.ssh/n8n root@72.62.82.26
```

### 2. 首次部署 - 服务器配置

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt update
sudo apt install nginx -y

# 创建项目目录
mkdir -p /var/www/contractorpro
```

### 3. 配置 Nginx

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/contractorpro
```

粘贴以下内容：
```nginx
server {
    listen 80;
    server_name contractorpro.maxwelllai.com;

    root /var/www/contractorpro;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/contractorpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 配置 SSL

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d contractorpro.maxwelllai.com
```

### 5. 使用部署脚本

在本地执行：
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## 配置 DNS

在您的域名管理面板中添加 A 记录：
- 类型: A
- 名称: contractorpro
- 值: 72.62.82.26
- TTL: 3600

---

## Supabase Edge Functions

Edge Functions 已经部署在 Supabase 上，不需要在服务器上配置。

确保以下 Secrets 已在 Supabase 控制台配置：
- `OPENAI_API_KEY` - 用于 AI 图像识别
- `SERPAPI_KEY` - 用于材料价格搜索

配置路径：Supabase Dashboard > Project > Edge Functions > Manage Secrets

---

## 常见问题

### 页面刷新后 404
确保 Nginx 配置中有 `try_files $uri $uri/ /index.html;`

### AI 功能不工作
检查 Supabase Edge Function Secrets 是否正确配置

### 查看日志
```bash
# Nginx 日志
sudo tail -f /var/log/nginx/contractorpro.error.log

# Supabase Edge Function 日志
# 在 Supabase Dashboard > Edge Functions > Logs 查看