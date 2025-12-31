#!/bin/bash
# Syncs master-data.yaml from ~/Documents/resume to the repo's data/ folder
# Run this after updating your resume YAML

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE="$HOME/Documents/resume/master-data.yaml"
DEST="$PROJECT_ROOT/data/master-data.yaml"

if [ -f "$SOURCE" ]; then
    cp "$SOURCE" "$DEST"
    echo "Synced: $SOURCE -> $DEST"
else
    echo "Error: Source file not found: $SOURCE"
    exit 1
fi
