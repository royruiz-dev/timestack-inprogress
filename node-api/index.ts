import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

// Route handler for GET requests on /ping endpoint
app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Route handler for GET requests on / endpoint
app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ currentTime: result.rows[0].now });
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
