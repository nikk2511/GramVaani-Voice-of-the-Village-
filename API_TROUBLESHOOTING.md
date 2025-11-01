# API Network Error Troubleshooting

If you're getting "Network Error" when trying to fetch districts or status, here's how to fix it:

## Quick Check

1. **Are you running locally?**
   ```bash
   cd frontend
   npm run dev
   ```
   Make sure the dev server is running on `http://localhost:3000`

2. **Are you on Vercel?**
   - Check Vercel deployment logs
   - Make sure API routes are deployed
   - Check if Root Directory is set to `frontend`

## Common Issues

### Issue 1: API Routes Not Accessible

**Symptoms:** Network Error when calling `/api/v1/districts` or `/api/v1/status`

**Fix:**
- Check if API routes exist: `frontend/src/app/api/v1/districts/route.js`
- Test directly: `http://localhost:3000/api/v1/status` (should return JSON)
- Check browser console for exact error

### Issue 2: Database Connection Failed

**Symptoms:** API routes return 500 error or timeout

**Fix:**
- Check `MONGO_URI` environment variable is set
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist includes Vercel IPs (or `0.0.0.0/0`)

### Issue 3: Missing Environment Variables

**Symptoms:** API returns 400 error "State code is required"

**Fix:**
- Set `STATE_CODE` environment variable (e.g., `UP`)
- In Vercel: Settings → Environment Variables

### Issue 4: CORS Issues

**Symptoms:** Network Error in browser console

**Fix:**
- This shouldn't happen with same-origin requests
- If using custom domain, check CORS settings

## Testing API Routes

### Test Locally:
```bash
# Start dev server
cd frontend
npm run dev

# Test in browser:
http://localhost:3000/api/v1/status
http://localhost:3000/api/v1/districts?state=UP
```

### Test on Vercel:
```
https://your-app.vercel.app/api/v1/status
https://your-app.vercel.app/api/v1/districts?state=UP
```

## Environment Variables Required

Make sure these are set (especially in Vercel):

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
REDIS_URL=rediss://default:pass@redis.upstash.io:6379
STATE_CODE=UP
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api/v1
```

## Debug Steps

1. Open browser console (F12)
2. Check Network tab for failed requests
3. Look at the request URL - is it correct?
4. Check response status code
5. Check error message in console

## Quick Fix

If you're on Vercel and getting Network Error:
1. Check Vercel build logs for errors
2. Verify Root Directory is set to `frontend`
3. Check environment variables are set
4. Redeploy the application

