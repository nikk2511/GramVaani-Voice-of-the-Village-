# Contributing Guidelines

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ../worker && npm install
   ```

3. Set up environment variables (copy from `.env.example`)
4. Start services:
   ```bash
   # Terminal 1: MongoDB and Redis (or use Docker)
   docker-compose up mongo redis
   
   # Terminal 2: Backend
   cd backend && npm run dev
   
   # Terminal 3: Frontend
   cd frontend && npm run dev
   
   # Terminal 4: Worker (optional)
   cd worker && npm run dev
   ```

## Code Style

- Use ESLint configuration
- Follow existing code patterns
- Write meaningful commit messages
- Add comments for complex logic

## Testing

- Write tests for new features
- Run tests before committing:
  ```bash
  npm test
  ```

## Pull Requests

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation if needed
5. Submit PR with clear description

