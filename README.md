# Monohall

A full-stack web application featuring a Next.js frontend and a Node.js/Express backend with SQLite.

## Project Structure

- `/` (Root): Next.js frontend application.
- `/backend`: Node.js Express backend API with a SQLite database.

## Getting Started

### 🚀 Fast Setup (VPS / Linux)

A `start.sh` script is included for quick, unattended deployment on a fresh Linux VPS. It will automatically install Node.js (if missing), configure your firewall (UFW or iptables), install all dependencies, and run both services in the background.

```bash
# Make sure you are in the root directory
sudo ./start.sh
```
To stop the services started by the script, simply press `Ctrl+C` in the terminal where it's running.

---

### 💻 Manual Local Setup

If you prefer to run the services manually for development, follow these steps:

#### 1. Backend Setup

```bash
cd backend
npm install
node server.js
```
The backend API will be available at `http://localhost:3001`.

#### 2. Frontend Setup

Open a new terminal and navigate to the project root:

```bash
npm install --legacy-peer-deps
npm run dev -- -p 8000
```
The frontend will be available at `http://localhost:8000`.

## Tech Stack

- **Frontend:** Next.js 16 (React 19), Tailwind CSS, Three.js (@react-three/fiber), GSAP, Lenis Smooth Scrolling.
- **Backend:** Node.js, Express, SQLite3, JWT Authentication, bcrypt.
