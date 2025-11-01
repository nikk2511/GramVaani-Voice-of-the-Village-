# Pre-Deployment Checklist

## Environment Setup
- [ ] Created `.env` file from `.env.example`
- [ ] Set `MONGO_URI` (MongoDB connection string)
- [ ] Set `REDIS_URL` (Redis connection URL)
- [ ] Obtained `DATA_GOV_API_KEY` from data.gov.in
- [ ] Generated secure `ADMIN_TOKEN`
- [ ] Set `STATE_CODE` (e.g., "UP", "MH")
- [ ] Set `NEXT_PUBLIC_API_URL` (production URL)

## Code Verification
- [ ] All dependencies installed (`npm install` in root, frontend, backend, worker)
- [ ] No linter errors
- [ ] Tests pass (`npm test`)
- [ ] TypeScript compiles (if using TS)
- [ ] No console errors in browser

## Docker Setup
- [ ] Docker and Docker Compose installed
- [ ] `docker-compose build` succeeds
- [ ] `docker-compose up -d` starts all services
- [ ] All containers are running (`docker-compose ps`)
- [ ] Health check passes (`curl http://localhost:3000/health`)

## Database
- [ ] MongoDB is accessible
- [ ] Initial data load completed
- [ ] Sample district data exists
- [ ] Metrics data exists for at least one district

## API Testing
- [ ] `GET /api/v1/districts?state=STATE_CODE` returns districts
- [ ] `GET /api/v1/districts/:id/summary` returns district data
- [ ] `GET /api/v1/districts/:id/metrics` returns time series
- [ ] `GET /api/v1/status` shows healthy status
- [ ] Redis caching works (check response times)

## Frontend Testing
- [ ] Frontend loads at http://localhost:3001
- [ ] District selector works
- [ ] Dashboard displays metrics
- [ ] Charts render correctly
- [ ] Language toggle works (EN/Hindi)
- [ ] Voice/TTS functionality works
- [ ] Mobile viewport works correctly
- [ ] Offline fallback shows cached data banner

## Worker Service
- [ ] Worker starts successfully
- [ ] Can fetch from data.gov.in API (test manually)
- [ ] Retry logic works (simulate API failure)
- [ ] Raw snapshots are saved
- [ ] Cron job scheduled correctly

## Production Deployment
- [ ] VPS/VM provisioned
- [ ] Domain name configured (optional)
- [ ] SSL certificate installed (Certbot)
- [ ] Nginx configured as reverse proxy
- [ ] Firewall rules configured
- [ ] Backup script set up
- [ ] Monitoring configured (optional)
- [ ] CI/CD pipeline configured (GitHub Actions)

## Security
- [ ] `.env` file not committed to git
- [ ] Admin endpoints protected with token
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input sanitization in place

## Documentation
- [ ] README.md updated
- [ ] DEPLOYMENT.md reviewed
- [ ] API documentation clear
- [ ] Loom script ready for recording

## Final Verification
- [ ] App accessible on production URL
- [ ] Mobile device testing completed
- [ ] Multiple districts tested
- [ ] Historical data displays correctly
- [ ] Comparison feature works
- [ ] Error handling graceful
- [ ] Performance acceptable (<3s load time)

## Optional Enhancements
- [ ] Geolocation working (requires GeoJSON data)
- [ ] Social sharing implemented
- [ ] Feedback mechanism implemented
- [ ] Admin dashboard UI created
- [ ] Analytics/tracking added

---

## Quick Test Commands

```bash
# Check services
docker-compose ps

# Check logs
docker-compose logs -f

# Test API
curl http://localhost:3000/api/v1/status

# Test frontend
curl http://localhost:3001

# Run tests
npm test

# Check MongoDB
docker-compose exec mongo mongosh --eval "db.adminCommand('listDatabases')"

# Check Redis
docker-compose exec redis redis-cli ping
```

