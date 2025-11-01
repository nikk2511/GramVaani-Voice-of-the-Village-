# Our Voice, Our Rights — MGNREGA District Performance Viewer

A production-grade, mobile-first web application that enables citizens to easily understand current and historical MGNREGA performance data for their district using visuals and text designed for low-literacy users.

## Features

- 📱 **Mobile-First Design**: Optimized for low-data, slow networks
- 🌐 **Multilingual**: English + Hindi support with transliteration
- 🔊 **Voice Support**: Text-to-speech for accessibility
- 📊 **Visual Analytics**: Charts and metrics for district performance
- 🔄 **Offline Resilience**: Cached data fallback when API is down
- 📍 **Auto-Detection**: Geolocation-based district detection (bonus)
- 🎨 **Low-Literacy UX**: Simple language, icons, large touch targets

## Tech Stack

- **Frontend**: Next.js 14 (React), Tailwind CSS
- **Database**: MongoDB
- **Cache**: Redis
- **Deployment**: Vercel (Serverless)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (Atlas recommended)
- Redis (Upstash recommended for serverless)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd internship-project/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   REDIS_URL=rediss://default:pass@redis.upstash.io:6379
   DATA_GOV_API_KEY=your_api_key
   ADMIN_TOKEN=your_secure_token
   STATE_CODE=UP
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## Deploy to Vercel

### Step 1: Connect Repository

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **IMPORTANT**: Set **Root Directory** to `frontend`
4. Framework: Next.js (auto-detected)

### Step 2: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
REDIS_URL=rediss://default:pass@redis.upstash.io:6379
DATA_GOV_API_KEY=your_api_key
ADMIN_TOKEN=your_secure_token
STATE_CODE=UP
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api/v1
```

### Step 3: Deploy

Click **Deploy** and wait for the build to complete.

## API Endpoints

- `GET /api/v1/districts?state=STATE_CODE` - List districts
- `GET /api/v1/districts/:id/summary` - District summary
- `GET /api/v1/districts/:id/metrics` - District metrics time series
- `GET /api/v1/compare?district1=ID&district2=ID` - Compare districts
- `GET /api/v1/status` - Health check

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── layout.jsx    # Root layout
│   │   └── page.jsx     # Home page
│   ├── components/      # React components
│   ├── lib/             # Utilities, models, configs
│   └── styles/          # CSS files
├── package.json
├── next.config.js
└── vercel.json
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `REDIS_URL` | Redis connection URL | Yes |
| `DATA_GOV_API_KEY` | data.gov.in API key | Yes |
| `ADMIN_TOKEN` | Secret token for admin endpoints | Yes |
| `STATE_CODE` | State code (e.g., "UP") | Yes |
| `NEXT_PUBLIC_API_URL` | Public API URL | Yes |

## Troubleshooting

### Build Fails

- Check that Root Directory is set to `frontend` in Vercel settings
- Verify all environment variables are set
- Check build logs in Vercel Dashboard

### 404 Errors

- Ensure Root Directory is set to `frontend` in Vercel
- Verify API routes are in `frontend/src/app/api/`
- Check that routes export `export const dynamic = 'force-dynamic'`

### Database Connection Issues

- Verify MongoDB Atlas IP whitelist includes Vercel IPs (or `0.0.0.0/0`)
- Check Redis URL format (should use `rediss://` for TLS)
- Ensure connection strings are correct in environment variables

## License

MIT License - see LICENSE file for details
