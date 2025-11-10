#!/bin/bash

# Convenience script to start both backend and frontend servers
# This starts both servers in the background

echo "🚀 Starting GLMakie Plot Generator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if backend is already running
if ps aux | grep "python main.py" | grep -v grep > /dev/null; then
    echo "⚠  Backend already running"
else
    echo "Starting backend server..."
    cd "$PROJECT_DIR/backend"
    ./start_server.sh > /tmp/glmakie_backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 2

    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "✓ Backend started (PID: $BACKEND_PID)"
        echo "  Logs: /tmp/glmakie_backend.log"
    else
        echo "✗ Backend failed to start. Check /tmp/glmakie_backend.log"
    fi
fi

echo ""

# Check if frontend is already running
if ps aux | grep "node.*vite" | grep -v grep > /dev/null; then
    echo "⚠  Frontend already running"
else
    echo "Starting frontend server..."
    cd "$PROJECT_DIR/frontend"
    ./start_frontend.sh > /tmp/glmakie_frontend.log 2>&1 &
    FRONTEND_PID=$!
    sleep 2

    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "✓ Frontend started (PID: $FRONTEND_PID)"
        echo "  Logs: /tmp/glmakie_frontend.log"
    else
        echo "✗ Frontend failed to start. Check /tmp/glmakie_frontend.log"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Application URLs:"
echo "   Backend:  http://localhost:8000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "📝 To stop servers, run: ./backend/stop_server.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
