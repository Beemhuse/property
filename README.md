# Bunkie Property Discover & Roommate Matching App

A premium, state-of-the-art Tinder-styled React + TypeScript student housing discovery and roommate compatibility matching application. Optimized with high-fidelity swiping gestures, keybinding shortcuts, event-driven particle match animations, and rich local storage integrations.

---

## 🛠️ Local Development Quick Start

Follow these steps to run the application natively on your system:

### 1. Install Dependencies
Ensure you have Node.js installed, then install all project requirements:
```bash
npm install
```

### 2. Start the Vite Development Server
Launch the development server with HMR (Hot Module Replacement):
```bash
npm run dev
```
Open your browser and navigate to the reported port (usually `http://localhost:5173`).

### 3. Compile Production Asset Bundle
Verify compilation integrity and bundle the optimized static pages locally:
```bash
npm run build
```

---

## 🐳 Docker Deployment & Containerization

The application is completely dockerized utilizing an enterprise-grade, **multi-stage build pipeline** paired with an optimized **Nginx static server** to host the single-page application (SPA).

### Why Nginx Stage is Used:
1. **Microscopic Image Footprint:** The final production container uses an Alpine Linux Nginx shell, keeping storage size minimal and eliminating heavy Node execution layers.
2. **HTML5 History Fallback (`try_files`):** Leverages a customized [nginx.conf](nginx.conf) mapping all dynamic router subpaths (like `/app/discover` or `/app/spaces/space-1`) to `index.html` to eliminate Nginx 404 errors during direct browser loads or refreshes.
3. **Static Compression (Gzip):** Pre-configured to compress CSS, JS, and HTML assets on the fly for lightning-fast loads.

### 1. Build the Docker Image
From the root of this project (where the `Dockerfile` resides), execute the build command to compile and tag the image:
```bash
docker build -t bunkie-discover-app .
```

### 2. Run the Container
Launch the built image in a detached background container, mapping your system's port **`8080`** to container port **`80`**:
```bash
docker run -d -p 8080:80 --name bunkie-instance bunkie-discover-app
```
Open your web browser and navigate to **`http://localhost:8080`** to experience the production version of the Bunkie swiper!

### 3. Inspect Container Logs
To monitor Nginx traffic and request logs:
```bash
docker logs bunkie-instance
```

### 4. Stop and Clean Container
To temporarily pause, start, or permanently dismantle the container instances:
```bash
# Stop the container
docker stop bunkie-instance

# Start the container again
docker start bunkie-instance

# Remove the container from records
docker rm -f bunkie-instance
```

---

## ⚙️ Project File Architecture

- **`Dockerfile`**: Sets up Node caching layers, compiles the React assets, and copies them to the Nginx serving workspace.
- **`nginx.conf`**: Configures port 80 routing, Gzip levels, and the SPA redirect fallback.
- **`.dockerignore`**: Excludes `node_modules` and compiled files from the docker context for instant builds.
