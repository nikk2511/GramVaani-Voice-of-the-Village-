# CRITICAL: Fix 404 Error - Root Directory Configuration

If you're seeing `404: NOT_FOUND` for **even the root path `/`**, this means Vercel is not detecting your Next.js app correctly.

## The Problem

When the root path `/` returns 404, it means Vercel is looking in the wrong directory or not recognizing the Next.js app structure.

## The Solution

### Step 1: Check Vercel Project Settings

1. Go to https://vercel.com/dashboard
2. Click on your project: `gram-vaani-voice-of-the-village`
3. Go to **Settings** → **General**
4. Scroll down to **Root Directory**
5. **IMPORTANT**: Make sure it's set to: `frontend`
   - If it says `/` or is empty, click **Edit**
   - Enter: `frontend` (without quotes, without leading slash)
   - Click **Save**

### Step 2: Verify Build Settings

In the same **Settings** → **General** page:

- **Framework Preset**: Should be `Next.js` (auto-detected)
- **Build Command**: Should be `npm run build` or empty (auto-detected)
- **Output Directory**: Should be `.next` or empty (auto-detected)
- **Install Command**: Should be `npm install` or empty (auto-detected)

### Step 3: Redeploy

After changing the Root Directory:

1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Click **Redeploy**
4. Wait for the build to complete

### Step 4: Test After Redeploy

Try accessing:
- `https://gram-vaani-voice-of-the-village.vercel.app/` (should load the home page)
- `https://gram-vaani-voice-of-the-village.vercel.app/api/hello` (should return JSON)

## If Root Directory is Already Set to `frontend`

If the Root Directory is already correct but you still get 404:

### Option A: Delete and Re-import Project

1. Delete the project in Vercel (Settings → Delete Project)
2. Go to https://vercel.com/new
3. Import the same GitHub repository
4. **IMPORTANT**: When prompted, set Root Directory to `frontend`
5. Add environment variables
6. Deploy

### Option B: Check Build Logs

1. Go to your latest deployment
2. Click **Build Logs**
3. Look for errors like:
   - "No Next.js version detected"
   - "Could not find package.json"
   - Any build errors

### Option C: Verify File Structure

Make sure your repository has this structure:
```
internship-project/
  frontend/
    package.json          ← Must have "next" in dependencies
    next.config.js        ← Must exist
    src/
      app/
        page.jsx          ← Must exist (root page)
        layout.jsx        ← Must exist
        api/
          hello/
            route.js      ← Test API route
```

## Quick Verification

Run these commands locally to verify structure:

```bash
cd frontend
npm install
npm run build
```

If the local build works, the issue is definitely Vercel configuration.

## After Fix

Once the root path works, test these endpoints:
1. `/` - Should show the home page
2. `/api/hello` - Should return `{"message":"Hello from Vercel!","timestamp":"..."}`
3. `/api/test` - Should return test response
4. `/api/v1/status` - Should return status (may error if DB not configured, but shouldn't be 404)

