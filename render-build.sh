#!/bin/bash
# Render build script — installs both frontend and backend deps, builds React

echo "📦 Installing frontend dependencies..."
npm install

echo "🔨 Building React frontend..."
npm run build

echo "🐍 Installing Python backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "✅ Build complete!"
