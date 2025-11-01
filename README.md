# Our Voice, Our Rights — MGNREGA District Performance Viewer

A production-grade, mobile-first web application that enables citizens to easily understand current and historical MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data for their district using visuals and text designed for low-literacy users.

## Features

- 📱 **Mobile-First Design**: Optimized for low-data, slow networks
- 🌐 **Multilingual**: English + Hindi support with transliteration
- 🔊 **Voice Support**: Text-to-speech for accessibility
- 📊 **Visual Analytics**: Charts and metrics for district performance
- 🔄 **Offline Resilience**: Cached data fallback when API is down
- 📍 **Auto-Detection**: Geolocation-based district detection (bonus)
- 🎨 **Low-Literacy UX**: Simple language, icons, large touch targets

## Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Cache**: Redis
- **Worker**: Node.js cron jobs with BullMQ
- **Containerization**: Docker + Docker Compose
- **Testing**: Jest, Playwright

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB (local or Atlas connection string)
- Redis (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd internship-project
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `MONGO_URI`: MongoDB connection string
   - `REDIS_URL`: Redis connection URL
   - `DATA_GOV_API_KEY`: Your data.gov.in API key
   - `ADMIN_TOKEN`: Secret token for admin endpoints
   - `STATE_CODE`: State code (e.g., "UP", "MH")
   - `PORT`: Server port (default: 3000)

3. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ../worker && npm install
   ```

4. **Run with Docker Compose**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

5. **Run initial data load**
   ```bash
   docker-compose exec worker node scripts/initial_load.js --state=<STATE_CODE> --months=36
   ```

6. **Access the application**
   - Frontend: http://localhost:3001
   - API: http://localhost:3000/api/v1
   - Health: http://localhost:3000/api/v1/status

## Development

### Run locally (without Docker)

```bash
# Terminal 1: Start MongoDB and Redis (if local)
# Or use cloud services

# Terminal 2: Start backend
cd backend && npm run dev

# Terminal 3: Start frontend
cd frontend && npm run dev

# Terminal 4: Start worker
cd worker && npm run dev
```

### Run tests

```bash
npm test              # All tests
npm run test:e2e      # E2E tests
```

## Deployment to Ubuntu VPS

### Prerequisites on VPS

- Ubuntu 20.04+
- Docker and Docker Compose installed
- Nginx installed
- Domain name pointed to VPS IP (for HTTPS)

### Deployment Steps

1. **SSH into your VPS**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Clone repository**
   ```bash
   git clone <repo-url>
   cd internship-project
   ```

3. **Copy and configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

4. **Build and start containers**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

5. **Set up Nginx reverse proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/mgnrega-viewer
   ```
   Add configuration (see `infrastructure/nginx.conf`)

6. **Enable site and restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/mgnrega-viewer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Set up HTTPS with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

8. **Run initial data load**
   ```bash
   docker-compose exec worker node scripts/initial_load.js --state=<STATE_CODE> --months=36
   ```

9. **Set up systemd service for worker (optional)**
   ```bash
   sudo cp infrastructure/mgnrega-worker.service /etc/systemd/system/
   sudo systemctl enable mgnrega-worker
   sudo systemctl start mgnrega-worker
   ```

10. **Verify deployment**
    ```bash
    curl http://localhost:3000/api/v1/status
    ```

### Monitoring

- Health endpoint: `/api/v1/status`
- Logs: `docker-compose logs -f`
- Monitoring setup: See `infrastructure/monitoring/` for Prometheus/Grafana configs

### Backups

Set up nightly MongoDB backups:
```bash
# Add to crontab
0 2 * * * docker-compose exec -T mongo mongodump --archive=/backup/mongo-$(date +\%Y\%m\%d).archive
```

## Project Structure

```
internship-project/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── worker/            # Data ingestion worker
├── infrastructure/    # Docker, Nginx, monitoring configs
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `GET /api/v1/districts?state=STATE_CODE` - List districts
- `GET /api/v1/districts/:id/summary?month=YYYY-MM` - District summary
- `GET /api/v1/districts/:id/metrics?from=YYYY-MM&to=YYYY-MM` - Time series
- `GET /api/v1/compare?district1=ID&district2=ID&metric=expenditure` - Comparison
- `POST /api/v1/admin/refresh?district=ID` - Force refresh (protected)
- `GET /api/v1/status` - Health check

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## License

MIT

