# CRITICAL: Fix Vercel 404 Error - Step by Step

If you're seeing `404: NOT_FOUND` on Vercel, follow these steps **IN ORDER**:

## Step 1: Verify Root Directory (MOST IMPORTANT!)

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Click **Settings** → **General**
4. Scroll down to **Root Directory**
5. **MUST BE SET TO**: `frontend` (exactly this, no quotes, no slashes)
6. If it's wrong:
   - Click **Edit**
   - Type: `frontend`
   - Click **Save**
   - **Redeploy** (go to Deployments tab → Redeploy)

## Step 2: Check Build Logs

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Build Logs**
4. Look for errors:
   - ❌ "No Next.js version detected" → Root Directory is wrong
   - ❌ "Could not find package.json" → Root Directory is wrong
   - ❌ Build errors → Fix the code issues
   - ✅ Build successful → Continue to Step 3

## Step 3: Verify Build Success

In Build Logs, you should see:
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/health
├ ƒ /api/v1/status
└ ƒ /api/v1/districts
```

If routes are listed, build is successful.

## Step 4: Check Function Logs

1. Go to **Deployments** → Latest deployment
2. Click **Functions** tab
3. Check if functions are listed:
   - `api/v1/districts`
   - `api/v1/status`
   - `api/health`
4. If functions are missing → Build failed or Root Directory wrong

## Step 5: Test API Routes Directly

Try these URLs directly:
- `https://your-app.vercel.app/api/health` (should return JSON)
- `https://your-app.vercel.app/api/v1/status` (should return JSON)
- `https://your-app.vercel.app/api/v1/districts?state=UP` (should return districts or empty array)

If these return 404:
- **Root Directory is NOT set correctly** OR
- **Build failed silently**

## Step 6: Delete and Re-import Project (Last Resort)

If nothing works:

1. **Delete the project in Vercel**:
   - Settings → Delete Project

2. **Re-import**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - **IMPORTANT**: When configuring:
     - Framework Preset: **Next.js**
     - Root Directory: **`frontend`** ⚠️
     - Build Command: Leave empty (auto)
     - Output Directory: Leave empty (auto)

3. **Set Environment Variables**:
   - Go to Settings → Environment Variables
   - Add:
     ```
     MONGO_URI=your_mongo_uri
     STATE_CODE=UP
     REDIS_URL=your_redis_url
     ```

4. **Deploy**

## Step 7: Verify File Structure

Your GitHub repo MUST have:
```
internship-project/
  frontend/
    package.json          ← Next.js must be here
    next.config.js
    src/
      app/
        page.jsx         ← Home page
        layout.jsx        ← Root layout
        api/
          v1/
            districts/
              route.js
            status/
              route.js
```

## Common Mistakes

❌ Root Directory = `/` (empty)
❌ Root Directory = `.` or `./`
❌ Root Directory = `./frontend`
✅ Root Directory = `frontend` (correct!)

## Quick Test After Fix

After setting Root Directory to `frontend` and redeploying:

1. Wait for build to complete (check Build Logs)
2. Test: `https://your-app.vercel.app/` (should show home page)
3. Test: `https://your-app.vercel.app/api/health` (should return JSON)

## Still Getting 404?

1. **Share your Vercel build logs** - Look for any errors
2. **Verify Root Directory** - It MUST be `frontend`
3. **Check GitHub repo structure** - Make sure `frontend/` folder exists with `package.json`
4. **Try accessing API routes directly** - `https://your-app.vercel.app/api/health`

## Environment Variables Needed

Make sure these are set in Vercel:
- `MONGO_URI` - MongoDB connection string
- `STATE_CODE` - e.g., `UP`
- `REDIS_URL` - Redis URL (optional but recommended)
- `NEXT_PUBLIC_API_URL` - Should be `https://your-app.vercel.app/api/v1` (set AFTER first deployment)

