#!/bin/bash

# 🚀 ChainX Protocol - One-Click Deployment to plataforma.chainx.ch
# Enterprise deployment script for immediate launch

echo "🔥 DEPLOYING CHAINX PROTOCOL - BRICKKEN KILLER 🔥"
echo "Domain: plataforma.chainx.ch"
echo "Infrastructure: Vercel Pro + Hostinger VPS"

# Step 1: Build optimized production version
echo "📦 Building production version..."
cd client
npm run build
cd ..

# Step 2: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

# Step 3: Configure custom domain
echo "🔗 Configuring custom domain..."
npx vercel domains add plataforma.chainx.ch

# Step 4: Setup environment variables
echo "⚙️ Setting up environment variables..."
npx vercel env add VITE_THIRDWEB_CLIENT_ID production
npx vercel env add VITE_THIRDWEB_SECRET_KEY production  
npx vercel env add VITE_OPENAI_API_KEY production
npx vercel env add VITE_DOMAIN production "plataforma.chainx.ch"

# Step 5: Final deployment with custom domain
echo "🚀 Final deployment..."
npx vercel --prod --yes

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "🌍 Website live at: https://plataforma.chainx.ch"
echo "📊 Analytics: https://vercel.com/dashboard"
echo "💰 Ready for beta launch and Brickken domination!"
echo ""
echo "Next steps:"
echo "1. Configure DNS in Hostinger panel"
echo "2. Test website functionality" 
echo "3. Launch beta program"
echo "4. Start generating revenue!"