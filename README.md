### TimeStack

A simple full-stack project designed to run in Docker, including:

- Node.js (TypeScript) and Go APIs connected to PostgreSQL (Postgres)
- React frontend built with Vite and TypeScript
- PostgreSQL database
- Docker Compose for service orchestration

---

### How to Run with Docker

Docker setup now includes Node.js API, Go API, React frontend, and Postgres services. Start the app using Docker Compose:

```bash
docker-compose up --build
```

Services:

- `postgres` (PostgreSQL)
- `node-api` (Node.js API with TypeScript)
  - Exposes `/ping` (health check) and `/` endpoints
- `go-api` (Go API)
  - Exposes `/ping` (health check) and `/` endpoints
- `react-client` (React + Vite frontend)
  - Fetches time data from the APIs

### Running Services Locally

Services can be run individually for local development. If local PostgreSQL instance is not running, start the Postgres container exposed on port `5432`:

```bash
docker compose up -d postgres
```

Then run each service locally:

#### Node.js API:

- `GET /ping`: returns "pong" (used for health checks)
- `GET /`: returns current time from PostgreSQL

```bash
cd node-api
npm install
npm run dev
```

#### Go API:

- `GET /ping`: returns "pong" (used for health checks)
- `GET /`: returns current time from PostgreSQL

```bash
cd go-api
go run main.go
```

#### React Client:

- Fetches time data from `go-api` and `node-api`

```bash
cd react-client
npm install
npm run dev
```

### Environment Variables (Local Development)

Create a `.env.local` file in `go-api/` and `node-api/` directories with:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

> **Note**: Replace the placeholders with your local database credentials.

### Next steps

- [ ] Refactor React app (modular components, API layer, better state management)
- [ ] Add health checks, logging/observability in backend and frontend services
- [ ] Containerize for production (multi-stage builds, environment separation, remove dev-tools, streamlined startup)
- [ ] Set up CI/CD with ArgoCD on Google Cloud (build/push images, deploy to GKE, GitOps automation)
- [ ] Enhance frontend UI/UX (styling, responsiveness)

### Tech Stack

| Layer     | Stack                     |
| :-------- | :------------------------ |
| Frontend  | React + Vite + TypeScript |
| Backend   | Node.js + TypeScript, Go  |
| Database  | PostgreSQL                |
| Dev Tools | Docker, Docker Compose    |
