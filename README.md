### TimeStack

A simple full-stack project designed to be run in Docker including:

- Node.js API using TypeScript and PostgreSQL
- Go API
- React frontend using Vite and TypeScript
- PostgreSQL database
- Docker Compose for orchestration (only `node-api` and `postgres` services are configured)

### How to run with Docker

Start the app using Docker Compose:

```bash
docker-compose up --build
```

> **Note**: Only the Node.js API and Postgres services are included in the Docker setup. The Go API and React app are not yet containerized.

### Running Locally

To run `node-api` and `go-api` services individually for development, ensure PostgreSQL is running locally first. This starts a local Postgres container exposed on port `5432`.

Start Postgres using Docker Compose:

```bash
docker compose up -d postgres
```

### Environment Variables

Create a `.env.local` file inside the `go-api/` and `node-api/` folders with the following variables:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

> **Note**: Replace the placeholders with your local credentials.

### API Endpoints (Node.js & Go)

Both APIs expose the same endpoints:

- `GET /ping`: Returns "pong" (used for health checks)
- `GET /`: Returns current time from PostegreSQL

### Running Each Service

Node.js API:

```bash
cd node-api
npm install
npm run dev
```

Go API:

```bash
cd go-api
go run main.go
```

### Frontend (React)

- Uses Vite + TypeScript
- Calls the API to fetch time data

To run the React application:

```bash
cd react-frontend
npm install
npm run dev
```

### Next steps

- [ ] Integrate `go-api` service into Docker Compose setup
- [ ] Build React components to load data from both APIs
- [ ] Connect React app to `go-api` and `node-api`
- [ ] Improve frontend UX/UI
- [ ] Add `react-frontend` to Docker Compose setup

### Tech Stack

| Layer     | Stack                     |
| :-------- | :------------------------ |
| Frontend  | React + Vite + TypeScript |
| Backend   | Node.js + TypeScript + Go |
| Database  | Database                  |
| Dev Tools | Docker, Docker Compose    |
