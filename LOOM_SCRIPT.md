# Loom Video Script - Our Voice, Our Rights
## Duration: <2 minutes

### Segment 1: Quick App Demo (20 seconds)
**Visual: Show mobile view in browser or mobile device**

**Script:**
- "This is Our Voice, Our Rights - a mobile-first web app for citizens to view MGNREGA district performance data."
- [Click on district selector dropdown]
- "Users can search and select their district from a large Indian state, or use geolocation to auto-detect."
- [Select a district, show loading]
- "Here's the district dashboard with key metrics: people benefited, expenditure, persondays generated, and works completed."
- [Point to metric tiles] "Each metric has large, colorful tiles with icons - designed for low-literacy users."
- [Click voice button] "We've added text-to-speech support - users can hear explanations in their chosen language."

**Visual cues:**
- Mobile viewport
- District selector dropdown
- Metric tiles with icons
- Voice button interaction

---

### Segment 2: Historical Charts & Comparison (20 seconds)
**Visual: Scroll down to charts**

**Script:**
- "The dashboard shows historical trends for the last 24 months."
- [Point to line chart] "Simple line charts show people benefited and persondays over time."
- [Click compare button] "Users can compare their district with state averages or neighboring districts."
- [Show language toggle] "Everything works in both English and Hindi - just one click to switch."
- [Toggle to Hindi] "All text, voice, and UI elements switch languages instantly."

**Visual cues:**
- Historical chart scrolling
- Comparison feature
- Language toggle demonstration

---

### Segment 3: Admin & Data Ingestion (20 seconds)
**Visual: Show terminal/backend code or admin panel**

**Script:**
- "Behind the scenes, we have a worker service that fetches monthly data from data.gov.in's MGNREGA API."
- [Show worker code or status endpoint] "The worker uses exponential backoff retry logic - if the upstream API fails, we use cached snapshots."
- [Show status endpoint] "The system shows users when data might be stale with clear banners."
- "We store raw snapshots, so even if the official API is down for days, the app continues working with the last successful fetch."

**Visual cues:**
- Terminal showing worker logs
- Status API response
- Raw snapshot storage

---

### Segment 4: Hosting & Infrastructure (20 seconds)
**Visual: Show Docker setup or deployment diagram**

**Script:**
- "The entire app is Dockerized - one command to deploy."
- [Show docker-compose.yml] "We have MongoDB for data, Redis for caching, Node.js backend, Next.js frontend, and the worker service."
- [Show Nginx config] "Deployed on an Ubuntu VPS behind Nginx with HTTPS."
- "We have CI/CD pipelines, health monitoring, and nightly database backups."
- "The architecture scales horizontally - you can run multiple instances behind a load balancer."

**Visual cues:**
- Docker-compose file
- Architecture diagram (optional)
- Deployment scripts

---

### Segment 5: Extras & Wrap-up (10 seconds)
**Visual: Show codebase or features list**

**Script:**
- "Bonus features include geolocation-based district detection, social sharing, and a feedback mechanism."
- "The codebase is fully tested with unit and E2E tests."
- "Check out the README for one-command deployment instructions."
- "All code is available in the repository - link in description."

**Visual cues:**
- Repository structure
- Test files
- README highlights

---

## Tips for Recording:

1. **Preparation:**
   - Have the app running locally with sample data
   - Test all features before recording
   - Use mobile viewport (375px width) for mobile demo
   - Prepare terminal windows with worker logs ready

2. **Recording Settings:**
   - Use 1080p resolution
   - Clear audio (use good microphone)
   - Keep screen clean (close unnecessary windows)
   - Use cursor highlights if available

3. **Timing:**
   - Practice each segment to hit ~20 seconds
   - Total should be under 2 minutes
   - Cut transitions between segments

4. **Visual Quality:**
   - Use good lighting
   - Show actual working features (no mockups)
   - Highlight important UI elements with cursor
   - Zoom in on key interactions

5. **Post-Production:**
   - Add captions/subtitles for accessibility
   - Add chapter markers if possible
   - Include text overlay with key points
   - Add background music (optional, keep it subtle)

---

## Key Points to Emphasize:

✅ Mobile-first design for low-literacy users
✅ Multilingual support (English + Hindi)
✅ Voice/text-to-speech accessibility
✅ Offline resilience with caching
✅ Production-ready with Docker, CI/CD, monitoring
✅ Real data from data.gov.in API
✅ Scalable architecture

