# Database Setup Guide

## Problem: "No districts found. Please check your database connection."

This message appears when:
1. The database is empty (no districts loaded)
2. Database connection is failing
3. Environment variables are not set

## Quick Fix: Load Sample Districts

### Option 1: Using the API Endpoint (Recommended)

1. **Make sure your dev server is running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Load sample districts using curl or browser:**
   
   **Using curl:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/admin/seed-districts?state=UP
   ```
   
   **Using browser:**
   - Open: `http://localhost:3000/api/v1/admin/seed-districts?state=UP`
   - But this is a POST request, so use a tool like Postman or use curl

   **Using PowerShell:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3000/api/v1/admin/seed-districts?state=UP" -Method POST
   ```

3. **Refresh the app** - districts should now appear!

### Option 2: Check Database Connection

1. **Verify Environment Variables:**
   Create a `.env.local` file in `frontend/` directory:
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   STATE_CODE=UP
   REDIS_URL=rediss://default:pass@redis.upstash.io:6379
   ```

2. **Test Database Connection:**
   Visit: `http://localhost:3000/api/v1/status`
   - Should show `"mongodb": "connected"` if working
   - If `"mongodb": "error"`, check your MONGO_URI

3. **Check MongoDB:**
   - Use MongoDB Compass or MongoDB Atlas dashboard
   - Verify database and collection exist
   - Check if `districts` collection has any documents

## For Vercel Deployment

1. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add:
     - `MONGO_URI` - Your MongoDB connection string
     - `STATE_CODE` - e.g., `UP`
     - `REDIS_URL` - Your Redis URL (optional)

2. **Seed Districts on Vercel:**
   - After deployment, call the seed endpoint:
   ```bash
   curl -X POST https://your-app.vercel.app/api/v1/admin/seed-districts?state=UP
   ```

3. **Verify:**
   - Visit: `https://your-app.vercel.app/api/v1/districts?state=UP`
   - Should return list of districts

## Troubleshooting

### "No districts found" but database connection works

- Database is empty
- Solution: Call `/api/v1/admin/seed-districts?state=UP`

### "Database connection error"

- `MONGO_URI` not set or incorrect
- MongoDB cluster not accessible (check IP whitelist)
- Solution: Check environment variables and MongoDB settings

### Districts not appearing after seeding

- Check API response: `/api/v1/districts?state=UP`
- Check browser console for errors
- Verify `STATE_CODE` matches the seeded state

## Next Steps

After seeding districts, you'll need to:
1. Load district metrics (MGNREGA data) - requires data.gov.in API
2. Set up a worker/cron job to regularly fetch new data

For now, the sample districts will allow you to test the UI and search functionality.

