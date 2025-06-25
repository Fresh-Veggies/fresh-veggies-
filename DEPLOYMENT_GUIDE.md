# Fresh Veggies Deployment Guide 🚀

This guide covers deploying Fresh Veggies to various platforms with proper environment variable configuration.

## 📋 Pre-Deployment Checklist

### Required Environment Variables
Copy from `api/env.production.example` and set these:

**Essential Variables:**
- `DATABASE_URL` - Your production database
- `SECRET_KEY` - Strong JWT secret (32+ characters)
- `GOOGLE_MAPS_API_KEY` - For location features
- `FRONTEND_URL` - Your frontend domain

**SMS Service (Choose One):**
- `SMS_PROVIDER=free_sms` (recommended for testing)
- Or configure Twilio/TextBee credentials

## 🌐 Platform-Specific Deployment

### 1. Railway.app (Recommended)

**Backend Deployment:**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy API
cd api
railway login
railway deploy

# 3. Set environment variables in Railway dashboard
```

**Environment Variables in Railway:**
```
DATABASE_URL=postgresql://postgres:password@host:5432/railway
SECRET_KEY=your-super-secret-production-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FRONTEND_URL=https://your-app.vercel.app
SMS_PROVIDER=free_sms
ENVIRONMENT=production
DEBUG=false
```

**Frontend Deployment (Vercel):**
```bash
# 1. Deploy frontend
cd ..
vercel --prod

# 2. Set environment variables in Vercel dashboard
```

### 2. Heroku

**Backend:**
```bash
# 1. Create Heroku app
heroku create fresh-veggies-api

# 2. Set environment variables
heroku config:set DATABASE_URL="postgresql://..."
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set GOOGLE_MAPS_API_KEY="your-api-key"
heroku config:set FRONTEND_URL="https://your-frontend.vercel.app"
heroku config:set SMS_PROVIDER="free_sms"

# 3. Deploy
git push heroku main
```

### 3. DigitalOcean App Platform

Create `api/.do/app.yaml`:
```yaml
name: fresh-veggies
services:
- name: api
  source_dir: /api
  github:
    repo: your-username/fresh-veggies
    branch: main
  run_command: uvicorn main:app --host 0.0.0.0 --port $PORT
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DATABASE_URL
    value: ${DATABASE_URL}
  - key: SECRET_KEY
    value: ${SECRET_KEY}
  - key: GOOGLE_MAPS_API_KEY
    value: ${GOOGLE_MAPS_API_KEY}
```

### 4. AWS EC2 / VPS Manual Setup

```bash
# 1. Server setup
sudo apt update
sudo apt install python3 python3-pip nginx

# 2. Clone and setup
git clone https://github.com/your-username/fresh-veggies.git
cd fresh-veggies/api
pip3 install -r requirements.txt

# 3. Create environment file
cp env.production.example .env
# Edit .env with your actual values

# 4. Setup systemd service
sudo nano /etc/systemd/system/fresh-veggies.service
```

**Systemd Service File:**
```ini
[Unit]
Description=Fresh Veggies API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/fresh-veggies/api
Environment=PATH=/home/ubuntu/fresh-veggies/venv/bin
EnvironmentFile=/home/ubuntu/fresh-veggies/api/.env
ExecStart=/home/ubuntu/fresh-veggies/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## 🔧 Environment Variable Setup by Platform

### Railway Dashboard
1. Go to your project dashboard
2. Click "Variables" tab
3. Add each variable one by one
4. Deploy will automatically restart

### Vercel Dashboard  
1. Go to your project settings
2. Click "Environment Variables"
3. Add frontend variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
   ```

### Heroku CLI
```bash
# Set all at once
heroku config:set \
  DATABASE_URL="postgresql://..." \
  SECRET_KEY="your-secret" \
  GOOGLE_MAPS_API_KEY="your-key" \
  FRONTEND_URL="https://your-app.vercel.app"
```

## 🗄️ Database Setup

### PostgreSQL (Production)
```sql
-- Create database
CREATE DATABASE fresh_veggies;

-- Create user
CREATE USER fresh_veggies_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE fresh_veggies TO fresh_veggies_user;
```

### Railway PostgreSQL
1. Add PostgreSQL service in Railway
2. Use the provided `DATABASE_URL`
3. Tables will be created automatically

### Migration for Location Features
```python
# Run this after deployment to add location columns
from sqlalchemy import text
from app.database.connection import engine

with engine.connect() as conn:
    conn.execute(text('ALTER TABLE orders ADD COLUMN delivery_latitude REAL'))
    conn.execute(text('ALTER TABLE orders ADD COLUMN delivery_longitude REAL'))
    conn.commit()
```

## 🔐 Security Best Practices

### Production Secrets
```bash
# Generate strong SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Example output: vQj9K8p2mR7sN3tL5fH9wX1zY4uE6qA8pD0sF3gH7jK2mN5tR8w
```

### Environment Variable Security
- Never commit `.env` files
- Use different keys for dev/staging/production  
- Rotate secrets regularly
- Use secure database passwords

## 📱 Frontend Environment Variables

Create `frontend/.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.railway.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🧪 Deployment Testing

### Health Check Endpoints
Test these after deployment:
```bash
# API health
curl https://your-api.railway.app/

# Database connectivity  
curl https://your-api.railway.app/api/auth/test

# Location features
curl https://your-api.railway.app/api/delivery/orders/with-locations
```

### Frontend Testing
- Location input component
- Order creation with GPS
- Admin panel functionality

## 🚨 Troubleshooting

### Common Issues:

**"Config not found" Error:**
- Ensure all environment variables are set
- Check variable names match exactly

**Database Connection Failed:**
- Verify `DATABASE_URL` format
- Check database server accessibility

**Google Maps Not Loading:**
- Verify `GOOGLE_MAPS_API_KEY` is valid
- Check API quotas and billing

**SMS Not Sending:**
- Check `SMS_PROVIDER` configuration
- Verify service credentials

## 📊 Production Monitoring

### Log Checking:
```bash
# Railway
railway logs

# Heroku  
heroku logs --tail

# VPS
sudo journalctl -u fresh-veggies -f
```

### Database Monitoring:
- Monitor connection counts
- Watch for slow queries
- Set up automated backups

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml` for automated deployment on push to main branch.

---

**Need Help?** Check the platform-specific documentation or create an issue in the repository. 