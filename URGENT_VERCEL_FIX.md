# URGENT: Fix "cd frontend" Error in Vercel

## The Problem
You're seeing: `Error: Command "cd frontend && npm install" exited with 1`

This means **ONE OF THESE is wrong in Vercel settings:**

## FIX ALL THREE SETTINGS:

### 1. Root Directory (MOST IMPORTANT)

**Location:** Vercel Dashboard → Your Project → Settings → General

**Must be:** `frontend` (exactly this word)

**How to fix:**
1. Scroll down to "Root Directory"
2. Click "Edit"
3. Type: `frontend`
4. Click "Save"

### 2. Build Command

**Location:** Vercel Dashboard → Your Project → Settings → General

**Must be:** EMPTY (or auto-detect, or just `npm run build`)

**How to fix:**
1. Scroll down to "Build Command"
2. Click "Edit"
3. **Clear it completely** OR set to: `npm run build`
4. **DO NOT** set to: `cd frontend && npm run build` (wrong!)
5. Click "Save"

### 3. Install Command

**Location:** Vercel Dashboard → Your Project → Settings → General

**Must be:** EMPTY (or auto-detect, or just `npm install`)

**How to fix:**
1. Scroll down to "Install Command"
2. Click "Edit"
3. **Clear it completely** OR set to: `npm install`
4. **DO NOT** set to: `cd frontend && npm install` (wrong!)
5. Click "Save"

## After Fixing:

1. Go to **Deployments** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for build

## Why This Happens:

- If Root Directory = `frontend`, Vercel automatically works in that directory
- You should **NOT** need `cd frontend` in any command
- If you see `cd frontend` in the error, Root Directory is NOT set correctly

## Verify Settings:

After fixing, in Build Logs you should see:
- ✅ `npm install` (NOT `cd frontend && npm install`)
- ✅ `npm run build` (NOT `cd frontend && npm run build`)
- ✅ Routes being listed: `Route (app)`

## If Still Broken:

**Delete and re-import:**
1. Settings → Delete Project
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. **During setup:**
   - Root Directory: `frontend`
   - Build Command: Leave EMPTY
   - Install Command: Leave EMPTY
5. Deploy

