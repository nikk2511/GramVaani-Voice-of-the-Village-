# Quick Vercel Deployment Guide

## Quick Start

1. **Push your code to GitHub**

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Framework: Next.js (auto-detected)

3. **Set Environment Variables** in Vercel Dashboard:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   REDIS_URL=rediss://default:pass@redis.upstash.io:6379
   DATA_GOV_API_KEY=your_key
   ADMIN_TOKEN=your_secure_token
   STATE_CODE=UP
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api/v1
   ```

4. **Deploy** - Click Deploy!

## What Changed for Vercel

✅ **Backend routes converted** to Next.js API routes in `frontend/src/app/api/v1/`
✅ **Database connections** optimized for serverless (caching)
✅ **Redis connection** updated for serverless compatibility
✅ **Models** moved to shared location in frontend
✅ **Environment variables** configured

## Important Notes

- The **worker service** (data fetching) should run separately or use Vercel Cron Jobs
- Use **MongoDB Atlas** and **Upstash Redis** for best serverless compatibility
- API routes have a 30-second timeout (upgrade for longer)
- See `VERCEL_DEPLOYMENT.md` for detailed instructions

