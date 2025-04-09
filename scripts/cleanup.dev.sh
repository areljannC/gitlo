#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Stopping and removing gitlo-dev containers and volumes..."
docker compose -f "$DIR/docker-compose.dev.yml" down --volumes

echo "Removing gitlo-dev image (if exists)..."
docker image rm gitlo-dev --force 2>/dev/null || echo "No image to remove."

echo "Cleanup complete."
