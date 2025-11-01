#!/bin/bash

# Deployment script for Ubuntu VPS
# Run this script on your VPS after cloning the repository

set -e

echo "🚀 Starting deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit .env file with your configuration before continuing."
        exit 1
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Pull latest code (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main || echo "⚠️ Git pull failed, continuing..."
fi

# Build Docker images
echo "🔨 Building Docker images..."
docker-compose build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start containers
echo "▶️ Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check health
echo "🏥 Checking service health..."
curl -f http://localhost:3000/health || echo "⚠️ Health check failed, but services may still be starting..."

# Run initial data load if needed
read -p "Do you want to run initial data load? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Running initial data load..."
    STATE_CODE=$(grep STATE_CODE .env | cut -d '=' -f2)
    docker-compose exec -T worker node scripts/initial_load.js --state=$STATE_CODE --months=36 || echo "⚠️ Initial load failed. You can run it manually later."
fi

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost:3001"
echo "🔌 API: http://localhost:3000/api/v1"
echo "📊 Status: http://localhost:3000/api/v1/status"

