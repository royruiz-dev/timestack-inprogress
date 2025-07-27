import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3000;

// Initialize PostgreSQL connection pool using env variables
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Route handler for GET /ping — Basic liveness check to confirm server is running
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Route handler for GET / — API root, returns current time from database
app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ currentTime: result.rows[0].now });
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// checkDatabaseConnection runs lightweight query to verify database connectivity
async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database health check failed with", error);
    return false;
  }
}

// Route handler for GET /healthdb — Health check to check database is reachable
app.get("/healthdb", async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseConnection();

  if (dbHealthy) {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(500).json({
      status: "unhealthy",
    });
  }
});

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
