#!/bin/bash

# Stop script for GLMakie Plot Generator servers

echo "Stopping GLMakie Plot Generator servers..."

# Stop backend server
BACKEND_PID=$(ps aux | grep "python main.py" | grep -v grep | awk '{print $2}')
if [ -n "$BACKEND_PID" ]; then
    echo "Stopping backend server (PID: $BACKEND_PID)..."
    kill $BACKEND_PID
    sleep 1
    # Force kill if still running
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Force stopping backend..."
        kill -9 $BACKEND_PID
    fi
    echo "✓ Backend stopped"
else
    echo "Backend server not running"
fi

# Stop frontend server
FRONTEND_PID=$(ps aux | grep "node.*vite" | grep -v grep | awk '{print $2}')
if [ -n "$FRONTEND_PID" ]; then
    echo "Stopping frontend server (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID
    sleep 1
    # Force kill if still running
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Force stopping frontend..."
        kill -9 $FRONTEND_PID
    fi
    echo "✓ Frontend stopped"
else
    echo "Frontend server not running"
fi

echo ""
echo "All servers stopped!"
