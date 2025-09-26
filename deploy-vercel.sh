# 🚀 DEPLOY TO VERCEL - ChainX Protocol
# Simple deployment guide for plataforma.chainx.ch

echo "🇨🇭 Deploying ChainX Protocol to plataforma.chainx.ch..."

# Step 1: Install Vercel CLI if not installed
npm install -g vercel

# Step 2: Login to Vercel
vercel login

# Step 3: Deploy to production
vercel --prod

echo "✅ Deployment initiated!"
echo "🌐 Your site will be available at: https://plataforma.chainx.ch"
echo ""
echo "Next steps:"
echo "1. Configure DNS in Hostinger panel"
echo "2. Add custom domain in Vercel dashboard" 
echo "3. Set environment variables"
echo "4. Launch beta program!"