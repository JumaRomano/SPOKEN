# Deployment Guide

**Spoken Word Of God Ministries - Church Management System**

This guide provides step-by-step instructions for deploying the ChMS to a production environment.

## Table of Contents

- [Server Requirements](#server-requirements)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [SSL/HTTPS Configuration](#ssl-https-configuration)
- [Process Management](#process-management)
- [Nginx Configuration](#nginx-configuration)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Backup Configuration](#backup-configuration)
- [Monitoring Setup](#monitoring-setup)
- [Troubleshooting](#troubleshooting)

---

## Server Requirements

### Minimum Production Server Specs

- **OS**: Ubuntu 20.04 LTS or newer
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **Network**: Static IP address with domain name

### Recommended Production Server Specs

- **OS**: Ubuntu 22.04 LTS
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 100 GB SSD
- **Network**: Static IP with CDN (Cloudflare)

### Required Software

- Node.js 18+ LTS
- PostgreSQL 14+
- Nginx (reverse proxy)
- PM2 (process manager)
- Git
- Certbot (Let's Encrypt SSL)

---

## Pre-Deployment Checklist

- [ ] Domain name purchased and DNS configured
- [ ] Server provisioned with static IP
- [ ] SSH access configured with key-based authentication
- [ ] Firewall rules configured (ports 80, 443, 22)
- [ ] Email SMTP credentials obtained
- [ ] Database backup strategy planned
- [ ] SSL certificate plan (Let's Encrypt recommended)

---

## Database Setup

### 1. Install PostgreSQL

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Verify installation
psql --version  # Should show PostgreSQL 14+
```

### 2. Secure PostgreSQL

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set PostgreSQL password
sudo -u postgres psql
```

In the PostgreSQL prompt:

```sql
-- Set password for postgres user
ALTER USER postgres WITH PASSWORD 'your_strong_password';

-- Create production database
CREATE DATABASE spoken_word_chms;

-- Create dedicated database user
CREATE USER chms_user WITH PASSWORD 'another_strong_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE spoken_word_chms TO chms_user;

-- Exit
\q
```

### 3. Configure PostgreSQL for Remote Access (if needed)

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Change listen_addresses
listen_addresses = 'localhost'  # Keep as localhost for security

# Edit pg_hba.conf for authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line for local connections
local   all             chms_user                               md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## Backend Deployment

### 1. Install Node.js

```bash
# Install Node.js 18 LTS using NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version
```

### 2. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/spoken-word-chms
sudo chown -R $USER:$USER /var/www/spoken-word-chms

# Clone repository
cd /var/www/spoken-word-chms
git clone https://github.com/your-org/spoken-word-chms.git .

# Or upload files via SCP/FTP
```

### 3. Install Dependencies

```bash
cd /var/www/spoken-word-chms/backend
npm install --production
```

### 4. Configure Environment Variables

```bash
# Create production .env file
nano .env
```

**Production .env Configuration:**

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spoken_word_chms
DB_USER=chms_user
DB_PASSWORD=your_database_password_here
DB_MAX_CONNECTIONS=20

# JWT Configuration
JWT_SECRET=generate_a_very_long_random_secret_key_here
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=another_very_long_random_secret_for_refresh
JWT_REFRESH_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=https://yourchurch.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@spokenword.com
EMAIL_PASSWORD=your_email_app_password
EMAIL_FROM=Spoken Word Of God Ministries <noreply@spokenword.com>

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=/var/www/spoken-word-chms/uploads

# Logging
LOG_LEVEL=info
LOG_DIR=/var/www/spoken-word-chms/logs

# Optional: Sentry for error tracking
SENTRY_DSN=your_sentry_dsn_if_using
```

**Generate Secure Secrets:**

```bash
# Generate random secrets for JWT
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Run Database Migrations

```bash
cd /var/www/spoken-word-chms/backend
npm run migrate
```

### 6. Seed Initial Data (First Time Only)

```bash
npm run seed
```

**Save the admin credentials printed to the console!**

### 7. Create Required Directories

```bash
mkdir -p /var/www/spoken-word-chms/uploads
mkdir -p /var/www/spoken-word-chms/logs
```

---

## Process Management (PM2)

### 1. Install PM2

```bash
sudo npm install -g pm2
```

### 2. Create PM2 Configuration

```bash
cd /var/www/spoken-word-chms/backend
nano ecosystem.config.js
```

**ecosystem.config.js:**

```javascript
module.exports = {
  apps: [{
    name: 'chms-backend',
    script: 'src/app.js',
    instances: 2,  // Number of instances (use 'max' for all CPUs)
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/www/spoken-word-chms/logs/pm2-error.log',
    out_file: '/var/www/spoken-word-chms/logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false
  }]
};
```

### 3. Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Follow the command it outputs

# Check status
pm2 status
pm2 logs chms-backend
```

### 4. PM2 Management Commands

```bash
# View logs
pm2 logs chms-backend

# Restart application
pm2 restart chms-backend

# Stop application
pm2 stop chms-backend

# Monitor resources
pm2 monit

# View detailed info
pm2 info chms-backend
```

---

## Frontend Deployment

### 1. Build Frontend

On your local machine or build server:

```bash
cd frontend
npm install
npm run build
```

This creates a `dist/` folder with optimized static files.

### 2. Upload to Server

```bash
# Create directory for frontend
sudo mkdir -p /var/www/spoken-word-chms/frontend

# Upload build files via SCP
scp -r dist/* user@your-server:/var/www/spoken-word-chms/frontend/

# Or use FTP/rsync
rsync -avz dist/ user@your-server:/var/www/spoken-word-chms/frontend/
```

### 3. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/spoken-word-chms/frontend
sudo chmod -R 755 /var/www/spoken-word-chms/frontend
```

---

## Nginx Configuration

### 1. Install Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/spoken-word-chms
```

**Nginx Configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourchurch.com www.yourchurch.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourchurch.com www.yourchurch.com;

    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourchurch.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourchurch.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Frontend (React SPA)
    location / {
        root /var/www/spoken-word-chms/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Disable caching for API
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    client_max_body_size 10M;
}
```

### 3. Enable Site and Test

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/spoken-word-chms /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d yourchurch.com -d www.yourchurch.com

# Follow prompts and enter email address

# Test automatic renewal
sudo certbot renew --dry-run

# Auto-renewal is configured via cron
```

### Manual SSL Certificate

If using a purchased SSL certificate:

1. Upload certificate files to `/etc/ssl/certs/`
2. Update Nginx configuration with correct paths
3. Restart Nginx

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check Nginx is routing correctly
curl https://yourchurch.com/api/health

# Check frontend is accessible
curl https://yourchurch.com
```

### 2. Test Key Functionality

1. **Login**: `https://yourchurch.com/login`
   - Use admin credentials from seed script
   
2. **API Test**: Use Postman/curl to test endpoints
   
3. **Database Connection**: Verify data is being saved

### 3. Performance Test

```bash
# Install Apache Bench (if not installed)
sudo apt install apache2-utils -y

# Simple load test (100 requests, 10 concurrent)
ab -n 100 -c 10 https://yourchurch.com/api/members
```

---

## Backup Configuration

### 1. Database Backup Script

```bash
sudo nano /usr/local/bin/backup-chms-db.sh
```

**Backup Script:**

```bash
#!/bin/bash

# Configuration
DB_NAME="spoken_word_chms"
DB_USER="chms_user"
BACKUP_DIR="/var/backups/chms"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/chms_backup_$DATE.sql.gz"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
PGPASSWORD='your_database_password' pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_FILE

# Delete old backups
find $BACKUP_DIR -name "chms_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_FILE"
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-chms-db.sh
```

### 2. Schedule Automatic Backups

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-chms-db.sh >> /var/log/chms-backup.log 2>&1
```

### 3. Restore from Backup

```bash
# Restore database
gunzip -c /var/backups/chms/chms_backup_20260108_020000.sql.gz | \
    PGPASSWORD='your_password' psql -U chms_user -h localhost spoken_word_chms
```

---

## Monitoring Setup

### 1. PM2 Monitoring

```bash
# Enable PM2 web dashboard (optional)
pm2 install pm2-server-monit
```

### 2. Application Log Monitoring

```bash
# View real-time logs
tail -f /var/www/spoken-word-chms/logs/app.log

# Search logs
grep "ERROR" /var/www/spoken-word-chms/logs/app.log
```

### 3. Server Monitoring Commands

```bash
# Check disk space
df -h

# Check memory usage
free -m

# Check CPU usage
top

# Check network connections
netstat -tuln
```

### 4. Recommended Monitoring Tools

- **UptimeRobot**: Free uptime monitoring
- **PM2 Plus**: Advanced process monitoring
- **PostgreSQL Admin Tools**: pgAdmin, DataGrip
- **Log Management**: Logrotate (pre-installed)

---

## Troubleshooting

### Backend Won't Start

```bash
# Check PM2 logs
pm2 logs chms-backend --lines 100

# Check if port is in use
sudo lsof -i :5000

# Verify environment variables
pm2 env chms-backend

# Check database connection
psql -U chms_user -h localhost -d spoken_word_chms
```

### Cannot Connect to Database

```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Test connection
PGPASSWORD='your_password' psql -U chms_user -h localhost -d spoken_word_chms
```

### Nginx 502 Bad Gateway

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart chms-backend
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Test SSL certificate
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -t
```

---

## Maintenance Tasks

### Regular Updates

```bash
# Update system packages (monthly)
sudo apt update && sudo apt upgrade -y

# Update application code
cd /var/www/spoken-word-chms
git pull origin main
cd backend && npm install --production
pm2 restart chms-backend

# Update frontend
cd frontend && npm run build
# Upload new build files
```

### Database Maintenance

```bash
# Analyze and optimize database (weekly)
PGPASSWORD='your_password' psql -U chms_user -h localhost -d spoken_word_chms -c "VACUUM ANALYZE;"

# Check database size
PGPASSWORD='your_password' psql -U chms_user -h localhost -d spoken_word_chms -c "SELECT pg_size_pretty(pg_database_size('spoken_word_chms'));"
```

---

## Security Recommendations

1. **Keep System Updated**: Regular security patches
2. **Use Strong Passwords**: 20+ character passwords with special characters
3. **Enable Firewall**: `ufw` to restrict access
4. **Regular Backups**: Test restore procedures quarterly
5. **Monitor Logs**: Review error logs weekly
6. **SSL/TLS Only**: Enforce HTTPS everywhere
7. **Limit SSH Access**: Key-based authentication only
8. **Database Security**: Restrict PostgreSQL to localhost
9. **Rate Limiting**: Already configured via API
10. **GDPR Compliance**: Implement data retention policies

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Support**: support@spokenword.com
