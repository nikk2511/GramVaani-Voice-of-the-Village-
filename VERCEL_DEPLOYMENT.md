# Deploying to Vercel

This guide will help you deploy the MGNREGA District Performance Viewer to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- MongoDB database (MongoDB Atlas recommended)
- Redis instance (Upstash Redis recommended for serverless)
- data.gov.in API key

## Step 1: Prepare Your Repository

The project has been configured to work with Vercel. The backend Express routes have been converted to Next.js API routes in `frontend/src/app/api/v1/`.

## Step 2: Set Up Database Services

### MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for Vercel)
5. Get your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)

### Redis (Upstash - Serverless Redis)

1. Go to https://upstash.com
2. Create a new Redis database
3. Choose a region close to your Vercel region
4. Copy the Redis URL (e.g., `rediss://default:password@redis-host.upstash.io:6379`)

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

4. **Deploy**:
   ```bash
   vercel
   ```

5. **Follow the prompts**:
   - Link to existing project or create new
   - Set root directory: `frontend`
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

6. **Set Environment Variables**:
   ```bash
   vercel env add MONGO_URI
   vercel env add REDIS_URL
   vercel env add DATA_GOV_API_KEY
   vercel env add ADMIN_TOKEN
   vercel env add STATE_CODE
   vercel env add NEXT_PUBLIC_API_URL
   ```

### Option B: Deploy via Vercel Dashboard

1. **Import Project**:
   - Go to https://vercel.com/new
   - Import your Git repository
   - Configure:
   - **Framework Preset**: Next.js (auto-detect)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT: This must be set to `frontend`**
   - **Build Command**: Leave empty (auto-detected) or `npm run build`
   - **Output Directory**: Leave empty (auto-detected) or `.next`
   - **Install Command**: Leave empty (auto-detected) or `npm install`

2. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add the following:
     ```
     MONGO_URI=mongodb+srv://...
     REDIS_URL=rediss://...
     DATA_GOV_API_KEY=your_key_here
     ADMIN_TOKEN=your_secure_token
     STATE_CODE=UP
     NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api/v1
     ```

3. **Deploy**:
   - Click "Deploy"

## Step 4: Configure Vercel Project

### Update vercel.json

Ensure `frontend/vercel.json` is configured correctly:

```json
{
  "functions": {
    "src/app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

### Set Build Settings

In Vercel Dashboard → Settings → General:
- Root Directory: `frontend`
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## Step 5: Load Initial Data

Since the worker service runs separately, you'll need to load data manually:

### Option 1: Use MongoDB Compass or MongoDB Shell

Connect to your MongoDB instance and run the initial load script locally:

```bash
# From project root
cd worker
node scripts/initial_load.js --state=UP --months=36
```

Make sure to set environment variables:
```bash
export MONGO_URI=your_mongo_uri
export DATA_GOV_API_KEY=your_api_key
export STATE_CODE=UP
```

### Option 2: Create a Vercel Cron Job

Create `frontend/vercel-cron.json`:

```json
{
  "crons": [
    {
      "path": "/api/v1/cron/fetch-data",
      "schedule": "0 2 1 * *"
    }
  ]
}
```

Then create the cron endpoint at `frontend/src/app/api/v1/cron/fetch-data/route.js` (similar to worker logic).

## Step 6: Verify Deployment

1. **Check Health Endpoint**:
   ```
   https://your-project.vercel.app/api/v1/status
   ```

2. **Test API Endpoints**:
   ```
   https://your-project.vercel.app/api/v1/districts?state=UP
   ```

3. **Check Frontend**:
   ```
   https://your-project.vercel.app
   ```

## Step 7: Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` or Vercel IPs
- Check connection string format
- Verify database user has proper permissions

### Redis Connection Issues

- Use Upstash Redis (serverless-friendly)
- Check Redis URL format
- Ensure TLS is enabled in connection string

### API Route Timeouts

- Increase `maxDuration` in `vercel.json`
- Optimize database queries
- Add caching layers

### Build Failures

- Check Node.js version (should be 18.x)
- Review build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `REDIS_URL` | Redis connection URL | `rediss://default:pass@host.upstash.io:6379` |
| `DATA_GOV_API_KEY` | data.gov.in API key | `your_api_key` |
| `ADMIN_TOKEN` | Secret token for admin endpoints | `random_secure_string` |
| `STATE_CODE` | State code to fetch data for | `UP` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `https://your-project.vercel.app/api/v1` |

## Next Steps

- Set up Vercel Cron Jobs for data fetching
- Configure monitoring and analytics
- Set up error tracking (Sentry)
- Enable CDN caching for static assets

## Notes

- The worker service should run separately (e.g., on a VPS or using Vercel Cron Jobs)
- MongoDB and Redis connections are cached for serverless compatibility
- API routes have a 30-second timeout limit (upgrade plan for longer)
- Consider using Vercel Edge Functions for high-traffic endpoints

