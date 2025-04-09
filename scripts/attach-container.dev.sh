#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTAINER=$(docker ps --filter "name=gitlo-dev" --format "{{.Names}}")

if [ -z "$CONTAINER" ]; then
  echo "No running gitlo-dev container found."
else
  echo "Attaching to $CONTAINER..."
  docker attach "$CONTAINER"
fi
