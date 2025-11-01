# CRITICAL: Fix "cd frontend: No such file or directory" Error

## The Problem

You're seeing this error:
```
sh: line 1: cd: frontend: No such file or directory
Error: Command "cd frontend && npm install" exited with 1
```

This means **Root Directory is NOT set to `frontend`** in Vercel.

## The Fix (CRITICAL - DO THIS NOW)

### Step 1: Open Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Click Your Project
Click on: `gram-vaani-voice-of-the-village`

### Step 3: Settings → General
1. Click **Settings** tab (top menu)
2. Click **General** (left sidebar)

### Step 4: Find Root Directory
Scroll down until you see:
```
Root Directory
```
It will show either:
- `/` (root - WRONG!)
- Empty (WRONG!)
- `frontend` (CORRECT!)

### Step 5: Change Root Directory
1. Click **Edit** button next to "Root Directory"
2. Type: `frontend` (exactly this word, no quotes, no slashes)
3. Click **Save**

### Step 6: Redeploy
1. Go to **Deployments** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete

### Step 7: Verify
After redeploy, check Build Logs:
- Should NOT show `cd frontend` error
- Should show `npm install` running in the frontend directory
- Should show routes being built

## Why This Happens

When Root Directory is NOT set to `frontend`:
- Vercel thinks your Next.js app is at the repo root
- But `package.json` is actually in `frontend/`
- So it fails trying to find Next.js

When Root Directory IS set to `frontend`:
- Vercel knows to look in `frontend/` folder
- It runs `npm install` directly in that folder
- No `cd frontend` needed

## If You Can't Find Root Directory Setting

If you don't see "Root Directory" option:

1. **Delete the project:**
   - Settings → Scroll to bottom → Delete Project

2. **Re-import:**
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - **During setup**, you'll see "Configure Project"
   - Look for **"Root Directory"** option
   - Set it to: `frontend`
   - Click Deploy

## Verify Your Repo Structure

Your GitHub repo should have:
```
internship-project/
  frontend/
    package.json     ← Next.js must be here
    src/
      app/
        page.jsx
        layout.jsx
```

If this structure exists, Root Directory MUST be `frontend`.

## Quick Test

After fixing Root Directory and redeploying:

✅ **Success indicators:**
- Build logs show routes: `Route (app)`
- Build completes successfully
- `https://your-app.vercel.app/` works

❌ **Still broken:**
- Build logs show `cd frontend: No such file or directory`
- Root Directory is still not set correctly

---

**TL;DR: Go to Vercel → Settings → General → Root Directory → Set to `frontend` → Redeploy**

