# Fixing 404: NOT_FOUND Error on Vercel

If you're seeing `404: NOT_FOUND` errors on Vercel, follow these steps:

## Quick Checks

1. **Verify Root Directory in Vercel Settings**
   - Go to your Vercel project settings
   - Under "General" → "Root Directory", ensure it's set to `frontend`
   - Save and redeploy

2. **Check Your Deployment URL**
   - Make sure you're accessing the correct URL format:
     - ✅ Correct: `https://your-app.vercel.app/api/test`
     - ❌ Wrong: `https://your-app.vercel.app/frontend/api/test`

3. **Verify Environment Variables**
   - Go to Vercel project settings → Environment Variables
   - Ensure all required variables are set:
     - `MONGO_URI`
     - `REDIS_URL`
     - `NEXT_PUBLIC_API_URL` (should be your Vercel app URL)
     - `STATE_CODE`
     - `ADMIN_TOKEN` (optional)

## Testing API Routes

Test these endpoints in order:

1. **Simple Test Route** (no dependencies):
   ```
   https://your-app.vercel.app/api/hello
   ```
   Should return: `{"message":"Hello from Vercel!","timestamp":"..."}`

2. **Basic Test Route**:
   ```
   https://your-app.vercel.app/api/test
   ```
   Should return: `{"message":"Test route works!","timestamp":"...","environment":"production"}`

3. **Health Check** (tests basic functionality):
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"...","message":"API is working"}`

4. **Status Endpoint** (requires DB):
   ```
   https://your-app.vercel.app/api/v1/status
   ```
   Should return status of MongoDB and Redis connections

## Common Causes & Solutions

### Cause 1: Routes Not Deployed
**Solution**: 
- Check Vercel build logs for any errors
- Ensure all API route files are committed to git
- Redeploy after pushing changes

### Cause 2: Build Configuration Issue
**Solution**:
- Verify `next.config.js` doesn't have `output: 'standalone'` (for Vercel)
- Check that `package.json` has `next` in dependencies

### Cause 3: Root Directory Mismatch
**Solution**:
- In Vercel project settings → Root Directory → Set to `frontend`
- Redeploy

### Cause 4: API Route Structure Issue
**Solution**:
- Verify routes are in `frontend/src/app/api/` directory
- Ensure each route has `export const dynamic = 'force-dynamic'`
- Check route file names are exactly `route.js` (not `route.ts` or `Route.js`)

### Cause 5: Environment Variables Missing
**Solution**:
- Add all required environment variables in Vercel
- Redeploy after adding variables

## Debugging Steps

1. **Check Build Logs**:
   - Go to Vercel dashboard → Your deployment → "Build Logs"
   - Look for any errors or warnings during the build

2. **Check Function Logs**:
   - Go to Vercel dashboard → Your deployment → "Functions" tab
   - Click on an API route to see runtime logs

3. **Test Locally First**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Then test: `http://localhost:3000/api/hello`

4. **Verify File Structure**:
   ```
   frontend/
     src/
       app/
         api/
           hello/
             route.js
           test/
             route.js
           v1/
             status/
               route.js
             districts/
               route.js
               [id]/
                 summary/
                   route.js
                 metrics/
                   route.js
             compare/
               route.js
   ```

## If Still Getting 404

1. **Clear Vercel Cache**:
   - Go to Settings → "Clear Cache"
   - Redeploy

2. **Check Vercel Project Settings**:
   - Framework Preset: Should be "Next.js"
   - Build Command: Should be `npm run build` (or empty, auto-detected)
   - Output Directory: Should be `.next` (or empty, auto-detected)
   - Install Command: Should be `npm install` (or empty, auto-detected)
   - Root Directory: **Must be `frontend`**

3. **Verify Git Connection**:
   - Ensure Vercel is connected to the correct GitHub repository
   - Check that the correct branch is set (usually `main`)

4. **Contact Vercel Support**:
   - If none of the above work, the issue might be Vercel-specific
   - Check Vercel status page: https://status.vercel.com

## Next Steps After Fix

Once API routes are working:

1. Test all endpoints: `/api/v1/districts`, `/api/v1/status`, etc.
2. Verify frontend can connect to API routes
3. Check that MongoDB and Redis connections work
4. Test the full application flow

