#!/usr/bin/env bash
# start-server.sh — Start mission-control production server
# Used by LaunchAgent for persistent background service

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Build if .next doesn't exist
if [[ ! -d ".next" ]]; then
    npx next build
fi

exec npx next start -p 3000
