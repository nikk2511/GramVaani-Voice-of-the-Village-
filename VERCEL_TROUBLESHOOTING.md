# Vercel 404 NOT_FOUND Troubleshooting

If you're seeing `404: NOT_FOUND` errors on Vercel, check the following:

## 1. Verify Root Directory is Set Correctly

In Vercel Dashboard → Settings → General:
- **Root Directory**: Must be set to `frontend`
- If not set correctly, API routes won't be found

## 2. Check Environment Variables

Ensure these are set in Vercel Dashboard → Settings → Environment Variables:
- `MONGO_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection URL (optional but recommended)
- `DATA_GOV_API_KEY` - Your API key
- `ADMIN_TOKEN` - Secret token
- `STATE_CODE` - State code (e.g., "UP")
- `NEXT_PUBLIC_API_URL` - Should be `https://your-project.vercel.app/api/v1` (set after first deployment)

## 3. Test API Routes

After deployment, test these URLs:

1. **Health Check** (no database required):
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"...","message":"API is working"}`

2. **Status Endpoint**:
   ```
   https://your-project.vercel.app/api/v1/status
   ```
   Will try to connect to MongoDB - if not configured, will show `mongodb: 'error'`

3. **Districts** (requires MongoDB with data):
   ```
   https://your-project.vercel.app/api/v1/districts?state=UP
   ```

## 4. Common Issues

### Issue: Routes return 404

**Possible causes:**
- Root Directory not set to `frontend` in Vercel settings
- Routes are in wrong location (should be in `frontend/src/app/api/`)
- Build failed (check Vercel build logs)

**Fix:**
1. Go to Vercel Dashboard → Project Settings → General
2. Set Root Directory to: `frontend`
3. Redeploy

### Issue: Routes return 500 Error

**Possible causes:**
- Missing `MONGO_URI` environment variable
- MongoDB connection failed
- Missing database/data

**Fix:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure `MONGO_URI` is set correctly
3. Verify MongoDB is accessible (IP whitelist, credentials)

### Issue: Build succeeds but routes don't work

**Possible causes:**
- Routes not properly exported
- Missing Next.js configuration

**Fix:**
- Check that all routes have `export async function GET()` or `export async function POST()`
- Verify `frontend/next.config.js` exists

## 5. Verify Deployment

1. **Check Build Logs**: Go to Vercel Dashboard → Deployments → Click latest deployment → View build logs

2. **Check Function Logs**: Go to Vercel Dashboard → Deployments → Click latest deployment → Functions tab

3. **Test Locally First**:
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```
   Then test: `http://localhost:3000/api/health`

## 6. Debug Steps

1. Add a simple test route at `frontend/src/app/api/test/route.js`:
   ```js
   import { NextResponse } from 'next/server';
   export async function GET() {
     return NextResponse.json({ message: 'Test route works!' });
   }
   ```
   Test: `https://your-project.vercel.app/api/test`

2. Check Vercel Function logs for errors:
   - Go to Vercel Dashboard
   - Select your project
   - Click on "Functions" tab
   - Look for error messages

3. Verify the route file exists:
   - Route should be at: `frontend/src/app/api/v1/[route]/route.js`
   - File must export `GET`, `POST`, etc.

## 7. Quick Health Check

Run this curl command (replace with your Vercel URL):
```bash
curl https://your-project.vercel.app/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","message":"API is working"}
```

If this works, the API routes are deployed correctly. If it returns 404, check Root Directory setting.

