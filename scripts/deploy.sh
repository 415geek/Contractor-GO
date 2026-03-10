#!/bin/bash

# ContractorPro Deployment Script
# Repository: https://github.com/415geek/Contractor-Pro.git
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting ContractorPro deployment..."

# Configuration
SERVER_USER="root"
SERVER_HOST="72.62.82.26"
SSH_KEY="~/.ssh/n8n"
REMOTE_DIR="/var/www/contractorpro"

# Build the project
echo "📦 Building project..."
npm run build

# Create remote directory if it doesn't exist
echo "📁 Preparing remote directory..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST "mkdir -p $REMOTE_DIR"

# Upload built files
echo "📤 Uploading files to server..."
scp -i $SSH_KEY -r dist/* $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# Upload Nginx config if it doesn't exist
echo "⚙️ Checking Nginx configuration..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST "
  if [ ! -f /etc/nginx/sites-available/contractorpro ]; then
    echo 'Nginx config not found, please configure manually'
  fi
"

# Reload Nginx
echo "🔄 Reloading Nginx..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "✅ Deployment complete!"
echo "🌐 Visit: https://contractorpro.maxwelllai.com"