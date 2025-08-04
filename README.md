### TimeStack

A simple full-stack project designed to run in Docker, including:

- Node.js (TypeScript) and Go APIs connected to PostgreSQL (Postgres)
- React frontend built with Vite and TypeScript
- PostgreSQL database
- Docker Compose for service orchestration

![App Demo](demo/app-demo.gif)

### Running Services Locally

You can run all services at once using Docker Compose or run them individually during development.

**Option A: Run All Services with Docker Compose**

Make sure Docker daemon is running, then start all services with:

```bash
docker compose up --build
```

This will launch the following services:

- **React Client** – `react-client` (React + Vite frontend)
- **Node.js API** – `node-api` (Node.js backend with TypeScript)
- **Go API** – `go-api` (Go backend)
- **PostgreSQL** – `postgres` database

**Option B: Run Services Individually**

If PostgreSQL instance is not running locally, start the Postgres container (exposed on port `5432`) with:

```bash
docker compose up -d postgres
```

Then run each service in a separate terminal:

#### Node.js API:

Returns current time data from PostgreSQL

```bash
cd node-api
npm install
npm run dev
```

#### Go API:

Returns current time data from PostgreSQL

```bash
cd go-api
go run main.go
```

#### React Client:

Fetches and displays time data from both APIs (`go-api` and `node-api`)

```bash
cd react-client
npm install
npm run dev
```

> **Warning**: You might face CORS issues when running services individually (outside Docker Compose). To prevent this, it is best to run all services together with **Docker Compose**, which uses Vite's built-in proxy to handle cross-origin requests correctly.

### Environment Variables (Local Development)

Create a `.env.local` file in `go-api/` and `node-api/` directories with:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

> **Note**: Replace placeholders with your actual PostgreSQL credentials.

### API Endpoints and Health Checks

Each API service (`go-api` and `node-api`) exposes the following routes:

| Endpoint        | Type                  | Purpose                                                                      |
| :-------------- | :-------------------- | :--------------------------------------------------------------------------- |
| `GET /`         | Main API endpoint     | Returns current timestamp retrieved from PostgreSQL.                         |
| `GET /ping`     | Liveness check        | Confirms API service is running. Returns `"pong"`.                           |
| `GET /healthdb` | Database health check | Verifies DB connectivity. Returns `status: ok` + `timestamp` or `unhealthy`. |

You can test endpoints locally using tools like `curl` or Postman:

```bash
curl http://localhost:3000/ping        # Liveness check (Node API)
curl http://localhost:8080/healthdb    # Database connectivity check (Go API)
```

### Tech Stack

| Layer     | Stack                     |
| :-------- | :------------------------ |
| Frontend  | React + Vite + TypeScript |
| Backend   | Node.js + TypeScript, Go  |
| Database  | PostgreSQL                |
| Dev Tools | Docker, Docker Compose    |

---

### Project Progress

#### Completed

- [x] Created `go-api` and `node-api` services with PostgreSQL integration
- [x] Setup PostgreSQL database named `timestack` with connection pooling
- [x] Loaded configuration from environment variables (`.env.local`) in backend services
- [x] Developed initial HTTP handlers and routes (`/ping`, `/`) with basic error handling in Go and Node APIs
- [x] Added `go-api` and `node-api` services into Docker Compose with networking and volume setup
- [x] Created `react-client` frontend to display timestamps from APIs
- [x] Used `react-query` for data fetching with basic loading and error handling states
- [x] Connected React app to `go-api` and `node-api` services
- [x] Added `react-client` into Docker Compose setup
- [x] Refactored `/ping` into health endpoint for liveness check
- [x] Added health endpoint `/healthdb` for database connectivity check
- [x] Integrated refresh button with "Refreshed X seconds ago" feature using `getTimeAgoString` utility
- [x] Created `BuiltWith` React component with animated tech logos
- [x] Enhanced overall app UI with responsive layout, color themes, and styles
- [x] Added API latency measurement and display in frontend UI
- [x] Improved fetch handling and UI responsiveness (disabled auto-refetch and disabled refresh button during fetch)
- [x] Enhanced frontend UI styling with grid layout for aligned data display
- [x] Shortened "Last Refreshed" time display format for better readability
- [x] Added `formatDate` and `formatTime` utility functions

#### Next steps

- [ ] Refactor React app (modular components, API layer, better state management)
- [ ] Add additional health/readiness checks logging, observability in backend/frontend services
- [ ] Containerize for production (multi-stage builds, environment separation, remove dev-tools, streamlined startup)
- [ ] Set up CI/CD with ArgoCD on Google Cloud (build/push images, deploy to GKE, GitOps automation)
- [ ] Continue to enhance frontend UI/UX (styling, responsiveness)
