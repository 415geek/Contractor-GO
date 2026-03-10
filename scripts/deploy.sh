#!/bin/bash

# ContractorPro 手动部署脚本
# 使用方法: ./scripts/deploy.sh

set -e

echo "🚀 开始部署 ContractorPro..."

# 配置
SERVER_HOST="72.62.82.26"
SERVER_USER="root"
SSH_KEY="~/.ssh/n8n"
REMOTE_PATH="/var/www/contractorpro"

# 1. 安装依赖
echo "📦 安装依赖..."
npm ci

# 2. 构建项目
echo "🔨 构建项目..."
npm run build

# 3. 上传文件到服务器
echo "📤 上传文件到服务器..."
scp -i $SSH_KEY -r dist/* $SERVER_USER@$SERVER_HOST:$REMOTE_PATH/

# 4. 重新加载 Nginx
echo "🔄 重新加载 Nginx..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "✅ 部署完成！"
echo "🌐 访问: https://contractorpro.maxwelllai.com"