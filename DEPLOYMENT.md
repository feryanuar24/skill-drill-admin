# 🚀 Deployment Guide - Admin Dashboard

Complete guide for deploying Skill Drill Admin Dashboard to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Build Process](#build-process)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Code Quality

- [ ] All features tested locally
- [ ] No console errors
- [ ] No console warnings
- [ ] No commented code
- [ ] No debug statements
- [ ] TypeScript check passes: `npm run check`

### Configuration

- [ ] `.env` file NOT committed to git
- [ ] `.env.example` committed with template
- [ ] `.gitignore` includes `.env`
- [ ] API URL configured for production
- [ ] All secrets in environment variables

### Security

- [ ] HTTPS enabled on backend API
- [ ] CORS properly configured
- [ ] JWT tokens use secure settings
- [ ] No sensitive data in localStorage keys
- [ ] Password fields never logged

### Testing

- [ ] Manual testing complete
- [ ] All CRUD operations work
- [ ] Login/logout works
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Mobile responsiveness tested

### Documentation

- [ ] README.md updated
- [ ] SETUP_GUIDE.md accurate
- [ ] Deployment instructions clear
- [ ] API endpoints documented

---

## 🔧 Environment Setup

### 1. Production Environment Variables

Create `.env.production` or set in deployment platform:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Skill Drill Admin
VITE_APP_VERSION=1.0.0
```

### 2. Backend API Requirements

Ensure backend is production-ready:

```bash
# Backend should be running with:
- HTTPS enabled
- CORS configured for your domain
- Database backups configured
- Error monitoring enabled
- Rate limiting configured
```

### 3. Database

- [ ] Database migrations applied
- [ ] Backups configured
- [ ] Connection pooling enabled
- [ ] Admin user account created

---

## 📦 Build Process

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Run Type Checking

```bash
npm run check
```

Fix any TypeScript errors before proceeding.

### 3. Build for Production

```bash
npm run build
```

Output:

```
dist/
├── index.html
├── assets/
│   ├── index.{hash}.js
│   ├── index.{hash}.css
│   └── ...
```

### 4. Verify Build

```bash
npm run preview
```

Test the production build locally:

- Login works
- All pages load
- API integration works
- No console errors

### 5. Build Size Check

```bash
# Check build size
du -sh dist/

# Expected: < 500KB total
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Ease)

#### Setup

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Login to Vercel:**

```bash
vercel login
```

3. **Deploy:**

```bash
vercel --prod
```

#### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://api.yourdomain.com/api`
3. Redeploy

#### Automatic Deployments from Git

1. Connect GitHub repository
2. Select main branch for production
3. Set environment variables
4. Auto-deploy on git push

**Vercel Dashboard:** https://vercel.com/dashboard

### Option 2: Netlify

#### Setup

1. **Connect GitHub:**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select repository

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables:**
   - Add: `VITE_API_URL` = `https://api.yourdomain.com/api`

4. **Deploy:**
   - Netlify auto-deploys on git push

**Netlify Site:** https://app.netlify.com/sites

### Option 3: Docker (Recommended for Control)

#### Build Docker Image

```bash
# Build image
docker build -t skill-drill-admin:1.0.0 .

# Tag for registry
docker tag skill-drill-admin:1.0.0 yourusername/skill-drill-admin:1.0.0

# Push to Docker Hub
docker push yourusername/skill-drill-admin:1.0.0
```

#### Deploy with Docker Compose

```yaml
version: "3.8"

services:
  admin:
    image: yourusername/skill-drill-admin:1.0.0
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=https://api.yourdomain.com/api
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

#### Run

```bash
docker-compose up -d
```

### Option 4: Nginx/Apache Static Hosting

#### Setup on VPS/Dedicated Server

1. **Build the app:**

```bash
npm run build
```

2. **Upload dist/ folder:**

```bash
scp -r dist/ user@yourserver:/var/www/admin/
```

3. **Nginx Configuration:**

```nginx
server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    root /var/www/admin;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass https://api.yourdomain.com/api/;
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }

    # SPA routing - all 404s go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Reload Nginx:**

```bash
sudo systemctl reload nginx
```

### Option 5: AWS S3 + CloudFront

#### Setup

1. **Create S3 Bucket:**

```bash
aws s3 mb s3://skill-drill-admin-prod
```

2. **Upload Build:**

```bash
aws s3 sync dist/ s3://skill-drill-admin-prod --delete
```

3. **Create CloudFront Distribution:**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error handling: 404 → index.html

4. **Set Environment Variables in CloudFront:**
   - Use Lambda@Edge or similar to inject `VITE_API_URL`

---

## ✅ Post-Deployment

### 1. Verify Deployment

- [ ] Site loads without errors
- [ ] HTTPS working
- [ ] API requests successful
- [ ] Login works with production database
- [ ] All features functional

### 2. Health Checks

```bash
# Check site
curl -I https://admin.yourdomain.com

# Check API connectivity
curl -H "Authorization: Bearer {token}" \
  https://api.yourdomain.com/api/users
```

### 3. Performance Monitoring

- [ ] Setup error tracking (Sentry)
- [ ] Setup analytics (Google Analytics)
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Setup performance monitoring (Datadog)

### 4. Security Headers

Ensure these are configured in your server:

```nginx
# Nginx example
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; connect-src 'self' https://api.yourdomain.com;";
```

### 5. Backup Strategy

- [ ] Daily backups of database
- [ ] Backup retention: 30 days
- [ ] Test restore procedure
- [ ] Document rollback plan

---

## 🔄 Continuous Deployment

### GitHub Actions (Automatic Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 🔧 Troubleshooting

### Site Not Loading

**Symptoms:** Blank page, 404 errors

**Solutions:**

1. Check that `dist/index.html` exists
2. Verify build was successful
3. Check server logs for errors
4. Verify file permissions (755 for dirs, 644 for files)

### API Connection Issues

**Symptoms:** "Failed to fetch" errors

**Solutions:**

1. Check `VITE_API_URL` is correct
2. Verify backend API is running
3. Check CORS headers in backend
4. Verify HTTPS certificates
5. Check firewall rules

### Login Issues

**Symptoms:** "Invalid credentials"

**Solutions:**

1. Verify admin account exists in production DB
2. Check credentials are correct
3. Verify JWT secret matches backend
4. Check token expiration settings

### Performance Issues

**Symptoms:** Slow load times, high CPU

**Solutions:**

1. Enable gzip compression
2. Setup CDN (CloudFront, Cloudflare)
3. Optimize images
4. Enable caching headers
5. Monitor API response times

### SSL/TLS Issues

**Symptoms:** "Not secure" warning, SSL errors

**Solutions:**

1. Verify certificate is valid
2. Check certificate expiration date
3. Install intermediate certificates
4. Update server SSL configuration

---

## 📊 Monitoring

### Essential Metrics

- **Availability:** Uptime percentage (target: 99.9%)
- **Performance:** Page load time (target: < 3s)
- **Errors:** Error rate (target: < 0.1%)
- **Users:** Monthly active users
- **API:** Response times, error rates

### Monitoring Tools

1. **Uptime Monitoring:**
   - UptimeRobot
   - Pingdom
   - Datadog

2. **Error Tracking:**
   - Sentry
   - Rollbar
   - Airbrake

3. **Analytics:**
   - Google Analytics
   - Mixpanel
   - Amplitude

4. **Performance:**
   - Datadog
   - New Relic
   - CloudFlare Analytics

---

## 🆘 Rollback Plan

### If Something Goes Wrong

1. **Immediate Actions:**
   - Disable site (return 503 Unavailable)
   - Alert on-call engineer
   - Check error logs

2. **Rollback:**

```bash
# Revert to previous version
git revert <commit-hash>
npm run build
# Re-deploy
```

3. **Post-Incident:**
   - Document what went wrong
   - Conduct post-mortem
   - Update deployment checklist
   - Implement preventive measures

---

## ✨ Best Practices

1. **Always test locally first**
   - Run `npm run build && npm run preview`
   - Test all features
   - Check console for errors

2. **Use staging environment**
   - Deploy to staging before production
   - Run full test suite
   - Get approval before production

3. **Monitor after deployment**
   - Watch error logs for first hour
   - Check performance metrics
   - Be ready to rollback if needed

4. **Document everything**
   - Keep deployment logs
   - Document configuration changes
   - Update runbooks

5. **Plan maintenance windows**
   - Schedule major updates for off-peak hours
   - Notify users in advance
   - Have rollback plan ready

---

## 📞 Getting Help

- Check logs: `docker logs <container-id>`
- Check browser console: F12
- Check backend logs: Check your backend deployment
- Ask on Discord/Slack channels
- Create GitHub issue for bugs

---

**Deployment Ready! 🚀**

Follow this guide carefully and your admin dashboard will be live in no time!
