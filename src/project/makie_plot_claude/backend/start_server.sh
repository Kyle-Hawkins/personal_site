#!/bin/bash

# Startup script for the GLMakie backend server
# This script sets up the environment and starts the FastAPI backend

echo "Starting GLMakie Plot Generator Backend..."
echo ""

cd "$(dirname "$0")/app"

# Source conda
source ~/miniconda3/etc/profile.d/conda.sh
conda activate glmakie-demo

# Set JULIA_PROJECT to use the correct environment
export JULIA_PROJECT=../julia-env

echo "✓ Environment activated"
echo "✓ Starting FastAPI server on http://localhost:8000"
echo ""
echo "Note: Julia will initialize in the background (takes ~30 seconds)"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
python main.py
