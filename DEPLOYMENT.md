# Deployment Guide

## Prerequisites

- Ubuntu 20.04+ VPS
- Docker and Docker Compose installed
- Domain name (optional, for HTTPS)
- Basic knowledge of Linux commands

## Step 1: Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

## Step 2: Clone Repository

```bash
cd /opt
sudo git clone <your-repo-url> mgnrega-viewer
cd mgnrega-viewer
sudo chown -R $USER:$USER .
```

## Step 3: Configure Environment

```bash
cp .env.example .env
nano .env
```

Fill in:
- `MONGO_URI`: MongoDB connection (use MongoDB Atlas or local)
- `REDIS_URL`: Redis connection
- `DATA_GOV_API_KEY`: Your API key from data.gov.in
- `ADMIN_TOKEN`: Generate a secure random token
- `STATE_CODE`: State code (e.g., "UP", "MH")
- `NEXT_PUBLIC_API_URL`: Your domain or IP

## Step 4: Build and Start Services

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## Step 5: Run Initial Data Load

```bash
# Wait for MongoDB to be ready
sleep 10

# Run initial load (adjust months as needed)
docker-compose exec worker node scripts/initial_load.js --state=UP --months=36
```

## Step 6: Configure Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo apt install nginx -y

# Copy configuration
sudo cp infrastructure/nginx.conf /etc/nginx/sites-available/mgnrega-viewer

# Edit configuration with your domain
sudo nano /etc/nginx/sites-available/mgnrega-viewer

# Enable site
sudo ln -s /etc/nginx/sites-available/mgnrega-viewer /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: Set Up HTTPS (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
```

## Step 8: Set Up Backups

Create a backup script:

```bash
sudo nano /usr/local/bin/backup-mgnrega.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
docker-compose exec -T mongo mongodump --archive=/backup/mongo-$DATE.archive
# Optional: Upload to S3 or remote storage
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-mgnrega.sh
```

Add to crontab:
```bash
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-mgnrega.sh
```

## Step 9: Monitoring (Optional)

```bash
# Set up Prometheus + Grafana
docker-compose -f docker-compose.yml -f infrastructure/monitoring/docker-compose.monitoring.yml up -d
```

## Step 10: Verify Deployment

```bash
# Check health endpoint
curl http://localhost:3000/health

# Check API status
curl http://localhost:3000/api/v1/status

# Check frontend
curl http://localhost:3001
```

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs worker
```

### MongoDB connection issues
```bash
# Check if MongoDB is running
docker-compose ps mongo

# Check MongoDB logs
docker-compose logs mongo
```

### Port conflicts
Edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "3002:3000"  # Change external port
```

### Worker not fetching data
```bash
# Check worker logs
docker-compose logs worker

# Manually trigger fetch
docker-compose exec worker node -e "require('./src/services/fetchService').fetchAllDistrictsForState('UP')"
```

## Maintenance

### Update Application
```bash
git pull
docker-compose build
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f --tail=100
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services
```bash
docker-compose down
```

### Remove Everything (Caution!)
```bash
docker-compose down -v  # Removes volumes too
```

