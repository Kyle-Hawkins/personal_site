#!/bin/bash

# Startup script for the GLMakie frontend server
# This script sets up the frontend and starts the Vite dev server

echo "Starting GLMakie Plot Generator Frontend..."
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠ node_modules not found. Running npm install..."
    npm install
    echo ""
fi

echo "✓ Dependencies ready"
echo "✓ Starting Vite dev server on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
