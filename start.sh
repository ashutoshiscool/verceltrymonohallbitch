#!/bin/bash

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (or use sudo)"
  exit 1
fi

FRONTEND_PORT=8000
PORTS=($FRONTEND_PORT)
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== System Update and System Dependencies ==="
apt-get update
apt-get install -y curl lsof psmisc postgresql-client

echo "=== Node.js Installation ==="
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js (v20)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js is already installed ($(node -v))."
fi

echo "=== Port Check ==="
for PORT in "${PORTS[@]}"; do
    echo "Checking if port $PORT is in use..."
    if fuser -s ${PORT}/tcp; then
        echo "Port $PORT is in use. Killing process(es)..."
        fuser -k -9 ${PORT}/tcp 2>/dev/null
        sleep 2
        echo "Process(es) killed."
    else
        echo "Port $PORT is free."
    fi
done

echo "=== Firewall Configuration ==="
for PORT in "${PORTS[@]}"; do
    PORT_OPEN=false

    # Check if port is open in ufw
    if command -v ufw &> /dev/null && ufw status | grep -qw "$PORT"; then
        PORT_OPEN=true
    fi
    # Check if port is open in iptables
    if command -v iptables &> /dev/null && iptables -L INPUT -n | grep -qw "dpt:$PORT"; then
        PORT_OPEN=true
    fi

    if [ "$PORT_OPEN" = true ]; then
        echo "Port $PORT appears to be open in the firewall already."
    else
        echo "Port $PORT does not appear to be explicitly opened in the firewall. Attempting to open automatically..."
        if command -v ufw &> /dev/null; then
            echo "Using UFW to open port $PORT..."
            ufw allow $PORT
        elif command -v iptables &> /dev/null; then
            echo "Using iptables to open port $PORT..."
            iptables -I INPUT -p tcp --dport $PORT -j ACCEPT
        else
            echo "Installing UFW to manage firewall..."
            apt-get install -y ufw
            ufw allow $PORT
        fi
    fi
done

echo "=== Project Setup ==="
echo "Setting up Frontend..."
cd "$DIR" || exit 1
echo "Installing frontend NPM dependencies..."
npm install --legacy-peer-deps

echo "Building Next.js app..."
npm run build

echo "=== Installing PM2 (Process Manager) ==="
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

echo "=== Starting Applications ==="
# Stop existing PM2 processes if any
pm2 delete monohall-backend 2>/dev/null || true
pm2 delete monohall-frontend 2>/dev/null || true

echo "Starting Next.js frontend on port $FRONTEND_PORT..."
cd "$DIR" || exit 1
pm2 start "npm run start -- -p $FRONTEND_PORT" --name "monohall-frontend"

echo "The application is now running permanently in the background via PM2."
pm2 save
pm2 list
