#!/bin/bash
# ElderLink Dashboard - Cloudflare Pages Deployment Script

echo "🚀 Deploying ElderLink Dashboard to Cloudflare Pages..."

# Check if wrangler is available
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first:"
    echo "   npm install -g wrangler"
    echo "   or visit: https://developers.cloudflare.com/workers/wrangler/install-and-update/"
    exit 1
fi

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run:"
    echo "   wrangler login"
    exit 1
fi

# Deploy to Cloudflare Pages
echo "📦 Deploying static files from dist/ directory..."
wrangler pages deploy dist --project-name elderlink-dashboard

if [ $? -eq 0 ]; then
    echo "✅ Dashboard deployed successfully!"
    echo "🌐 Your dashboard should be available at:"
    echo "   https://elderlink-dashboard.pages.dev"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
