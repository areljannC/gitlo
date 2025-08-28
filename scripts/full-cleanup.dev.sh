#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Stopping all running Docker containers..."
docker stop $(docker ps -aq)

echo "Removing all Docker containers..."
docker rm $(docker ps -aq)

echo "Removing all Docker images..."
docker rmi $(docker images -q)

echo "Removing all unused Docker volumes..."
docker volume prune -f

echo "Removing all unused Docker networks..."
docker network prune -f

echo "Removing all unused Docker data..."
docker system prune -a -f --volumes

echo "Full Docker cleanup complete."