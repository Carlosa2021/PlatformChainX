# 🇨🇭 ChainX Protocol - Hostinger + Vercel Configuration
# Swiss-hosted enterprise tokenization platform

## HOSTINGER PANEL CONFIGURATION

### DNS Settings (Hostinger Panel)
```
Domain: plataforma.chainx.ch
Type: CNAME
Name: @
Target: cname.vercel-dns.com
TTL: 1 Hour

Type: CNAME  
Name: www
Target: cname.vercel-dns.com
TTL: 1 Hour

Type: CNAME
Name: api
Target: your-vps-hostname.hostinger.com
TTL: 1 Hour
```

### SSL Certificate
- Enable "Force HTTPS redirect" in Hostinger panel
- Vercel will handle SSL automatically for frontend
- Configure SSL for API subdomain in VPS

## VERCEL DEPLOYMENT COMMANDS

### One-time setup:
```bash
npm install -g vercel
vercel login
```

### Deploy to production:
```bash
# Build and deploy
cd client
npm run build
cd ..
vercel --prod

# Add custom domain
vercel domains add plataforma.chainx.ch

# Verify domain
vercel domains verify plataforma.chainx.ch
```

### Environment Variables (Set in Vercel Dashboard):
```env
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
VITE_THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_API_URL=https://api.plataforma.chainx.ch
VITE_APP_NAME=ChainX Protocol
VITE_DOMAIN=plataforma.chainx.ch
```

## VPS BACKEND SETUP (api.plataforma.chainx.ch)

### Install dependencies:
```bash
# Login to your Hostinger VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install PostgreSQL
apt install postgresql postgresql-contrib -y
```

### Deploy API:
```bash
# Clone repository
git clone https://github.com/Carlosa2021/PlatformChainX.git
cd PlatformChainX/api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Setup database
npx prisma migrate deploy
npx prisma generate

# Start with PM2
pm2 start src/server.ts --name "chainx-api"
pm2 startup
pm2 save
```

### Nginx Configuration:
```nginx
# /etc/nginx/sites-available/chainx
server {
    listen 80;
    server_name api.plataforma.chainx.ch;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## PRODUCTION ENVIRONMENT VARIABLES

### Frontend (.env.production):
```env
VITE_THIRDWEB_CLIENT_ID=your_pro_client_id
VITE_THIRDWEB_SECRET_KEY=your_pro_secret_key
VITE_API_URL=https://api.plataforma.chainx.ch
VITE_OPENAI_API_KEY=your_openai_key
VITE_APP_NAME=ChainX Protocol - Swiss Enterprise Tokenization
VITE_DOMAIN=plataforma.chainx.ch
VITE_ENVIRONMENT=production
```

### Backend (.env):
```env
DATABASE_URL=postgresql://chainx_user:secure_password@localhost:5432/chainx_production
THIRDWEB_SECRET_KEY=your_pro_secret_key
THIRDWEB_CLIENT_ID=your_pro_client_id
OPENAI_API_KEY=your_openai_key
NEXTAUTH_SECRET=super-secure-random-string-256-bits
FRONTEND_URL=https://plataforma.chainx.ch
NODE_ENV=production
PORT=3000
```

## DEPLOYMENT CHECKLIST

### Pre-deployment:
- [ ] DNS configured in Hostinger panel
- [ ] VPS setup complete
- [ ] SSL certificates ready
- [ ] Environment variables configured
- [ ] Database migrated

### Deployment:
- [ ] Frontend built and deployed to Vercel
- [ ] Custom domain configured
- [ ] API deployed to VPS
- [ ] Nginx configured and started
- [ ] PM2 process running

### Post-deployment:
- [ ] Website accessible at https://plataforma.chainx.ch
- [ ] API accessible at https://api.plataforma.chainx.ch
- [ ] SSL certificates working
- [ ] All features functional
- [ ] Performance optimized

## MONITORING & MAINTENANCE

### Performance Monitoring:
- Vercel Analytics (frontend)
- PM2 monitoring (backend)
- PostgreSQL performance
- SSL certificate renewal

### Backups:
- Daily database backups
- Code repository (GitHub)
- Environment configurations

## SWISS COMPETITIVE ADVANTAGES

### Why Switzerland (.ch domain):
✅ Financial hub reputation
✅ Crypto-friendly regulations  
✅ Privacy and security focus
✅ Enterprise trust factor
✅ EU market access

### Marketing Message:
"Swiss-engineered tokenization platform with enterprise-grade security and compliance."

This positions ChainX as premium, secure, and trustworthy - perfect for competing against Brickken!