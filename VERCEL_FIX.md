# Critical: Vercel 404 Error - Step-by-Step Fix

If you're getting `404: NOT_FOUND` on Vercel, **this is almost always a Root Directory configuration issue**.

## Step 1: Check Root Directory (MOST IMPORTANT)

1. Go to https://vercel.com/dashboard
2. Click on your project: `gram-vaani-voice-of-the-village`
3. Click **Settings** → **General**
4. Scroll down to **Root Directory**
5. **If it's NOT set to `frontend`:**
   - Click **Edit** next to Root Directory
   - Type: `frontend` (no quotes, no leading slash)
   - Click **Save**
6. **Go to Deployments tab**
7. Click **Redeploy** on the latest deployment

## Step 2: Check Build Logs

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Build Logs**
4. Look for errors like:
   - "No Next.js version detected"
   - "Could not find package.json"
   - Any build failures

If build failed, share the error message.

## Step 3: Verify Project Structure

Your project should have:
```
internship-project/
  frontend/
    package.json          ← Next.js must be here
    next.config.js
    src/
      app/
        page.jsx         ← Home page
        layout.jsx       ← Root layout
        api/             ← API routes
```

## Step 4: Test After Redeploy

After setting Root Directory to `frontend` and redeploying:

1. Wait for build to complete (check Build Logs)
2. Try accessing:
   - `https://your-app.vercel.app/` (should show home page)
   - `https://your-app.vercel.app/api/health` (should return JSON)

## If Root Directory is Already Correct

If Root Directory is already set to `frontend` but you still get 404:

1. **Delete and re-import the project:**
   - Go to Settings → Delete Project
   - Go to https://vercel.com/new
   - Import the same GitHub repo
   - **When prompted, set Root Directory to `frontend`**
   - Add environment variables
   - Deploy

2. **Check GitHub repository:**
   - Make sure the `frontend` folder is committed to git
   - Verify `frontend/package.json` exists in the repo

## Quick Test

Run this locally to verify everything works:
```bash
cd frontend
npm install
npm run build
npm start
```

Then visit `http://localhost:3000` - if this works, the issue is Vercel configuration.

## Common Mistakes

❌ Root Directory set to `/` or empty
❌ Root Directory set to `.` or `./`
❌ Root Directory set to full path
✅ Root Directory set to `frontend` (correct!)

