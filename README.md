### TimeStack

A simple full-stak project, meant to be run in Docker, and including:

- Node.js API using TypeScript and PostgreSQL
- Go API (in progress)
- React frontend using Vite and TypeScript
- PostgreSQL database for connectivity
- Docker compose for orchestration (only node-api and postgres services are setup)

### How to run

Start the app (in progress) with:

```bash
docker-compose up --build
```

### API Endpoints (Node.js + Go)

- `GET /ping`: Returns "pong"
- `GET /`: Returns current time from PostegreSQL database

### Frontend (React)

- Uses Vite + TypeScript
- Calls the API to fetch time data

To run manually:

```bash
cd react-frontend
npm install
npm run dev
```

### Next steps

- [ ] Create HTTP handlers in Go to expose API endpoints
- [ ] Integrate go-api service into Docker Compose setup
- [ ] Build React components to load time from APIs
- [ ] Integrate react-frontend into Docker Compose setup

### Tech Stack

| Layer     | Stack                     |
| :-------- | :------------------------ |
| Frontend  | React + Vite + TypeScript |
| Backend   | Node.js + TypeScript + Go |
| Database  | Database                  |
| Dev Tools | Docker, Docker Compose    |
