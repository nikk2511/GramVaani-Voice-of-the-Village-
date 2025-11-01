# 🔴 HOW TO FIX VERCEL 404 ERROR - STEP BY STEP

## Problem
You're seeing `404: NOT_FOUND` because **Vercel doesn't know where your Next.js app is**.

## Solution (5 minutes)

### Step 1: Open Vercel Dashboard
Go to: https://vercel.com/dashboard

### Step 2: Click Your Project
Click on: `gram-vaani-voice-of-the-village` (or whatever your project name is)

### Step 3: Go to Settings
- Click **Settings** tab (at the top)
- Click **General** (on the left sidebar)

### Step 4: Find Root Directory
- Scroll down the page
- Look for a section called **"Root Directory"**
- You'll see something like:
  ```
  Root Directory
  /  [Edit]
  ```
  OR it might be empty

### Step 5: Change Root Directory
1. Click the **"Edit"** button next to Root Directory
2. A text field will appear
3. Type exactly: `frontend` (no quotes, no slashes, just the word)
4. Click **"Save"** button

### Step 6: Redeploy
1. Click **"Deployments"** tab (at the top)
2. Find the latest deployment
3. Click the **"..."** menu (three dots) on the right
4. Click **"Redeploy"**
5. Wait 2-3 minutes for the build to complete

### Step 7: Test
After build completes, try:
- `https://gram-vaani-voice-of-the-village.vercel.app/`
- Should now show your home page! ✅

---

## Visual Guide

**BEFORE (Wrong):**
```
Settings → General
Root Directory: /     [Edit]
```

**AFTER (Correct):**
```
Settings → General  
Root Directory: frontend     [Edit]
```

---

## If You Can't Find Root Directory

If you don't see "Root Directory" in Settings → General:

1. The project might be using an old Vercel setup
2. **Solution**: Delete and re-import the project:
   - Settings → Delete Project
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - **During setup**, you'll see "Root Directory" option
   - Set it to: `frontend`

---

## Verify It Worked

After redeploying:

✅ **Working:**
- `https://your-app.vercel.app/` → Shows home page
- `https://your-app.vercel.app/api/health` → Returns JSON

❌ **Still Broken:**
- `https://your-app.vercel.app/` → 404 error
- Means Root Directory is still wrong or build failed

---

## Build Logs Check

If still not working, check Build Logs:

1. Deployments → Latest deployment
2. Click **"Build Logs"**
3. Look for:
   - ✅ `Route (app)` section with routes listed = Build successful
   - ❌ `No Next.js version detected` = Root Directory wrong
   - ❌ `Could not find package.json` = Root Directory wrong

---

## Quick Checklist

- [ ] Root Directory = `frontend` (exactly this word)
- [ ] Saved the setting
- [ ] Redeployed after changing
- [ ] Build completed successfully
- [ ] Tested the URL

If all checked and still 404, share:
1. Screenshot of Settings → General (showing Root Directory)
2. Screenshot of Build Logs
3. Your Vercel project URL

