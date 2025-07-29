package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var dbpool *pgxpool.Pool // Reference pointer to PostgreSQL connection pool

func main() {
	// Load environment variables from .env.local file
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Println("No .env.local file foumd. Proceeding with environment variables.")
	}

	// Parse DB port from string to integer
	dbPortStr := os.Getenv("DB_PORT")
	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		log.Fatalf("Invalid DB_PORT: %v", err)
	}

	// Create empty pgxpool config struct to customize programmatically
	config, err := pgxpool.ParseConfig("")
	if err != nil {
		log.Fatalf("Failed to create pgxpool config: %v", err)
	}

	// Build pgxpool config from env variables to set connection details
	config.ConnConfig.Host = os.Getenv("DB_HOST")
	config.ConnConfig.Port = uint16(dbPort)
	config.ConnConfig.User = os.Getenv("DB_USER")
	config.ConnConfig.Password = os.Getenv("DB_PASSWORD")
	config.ConnConfig.Database = os.Getenv("DB_NAME")

	// Connect to the database
	ctx := context.Background()
	dbpool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbpool.Close()

	// Set HTTP server port
	const port = 8080

	// Define routes and their handlers
	http.HandleFunc("/ping", pingHandler)				// Route handler for GET /ping — Basic liveness check to confirm server is running
	http.HandleFunc("/", timeHandler)						// Route handler for GET / — API root, returns current time from database
	http.HandleFunc("/healthdb", healthHandler)	// Route handler for GET /healthdb — Health check to check database is reachable

	// Start the HTTP server
	fmt.Printf("Server is running on port %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

// Helper function that returns UTC timestamp with milliseconds (matches Node API)
func formatTimestamp(t time.Time) string {
	return t.UTC().Format("2006-01-02T15:04:05.000Z")
}

// pingHandler responds with "pong"
// Note: Request struct is passed as pointer – more efficient than passing value for every request
func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}

// timeHandler returns current time from database
func timeHandler(w http.ResponseWriter, r *http.Request) {
	var currentTime time.Time
	
	err := dbpool.QueryRow(context.Background(), "SELECT NOW()").Scan(&currentTime)
	if err != nil {
		log.Printf("Error querying the database: %v", err)
		http.Error(w, "Error querying the time", http.StatusInternalServerError)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(fmt.Sprintf(`{"currentTime":"%s"}`, formatTimestamp(currentTime))))
}

// checkDatabaseConnection runs lightweight query to verify database connectivity
func checkDatabaseConnection() bool {
	var number int
	err := dbpool.QueryRow(context.Background(), "SELECT 1").Scan(&number)
	if err != nil {
		log.Printf("Database health check failed with %v", err)
		return false
	}
	return true
}

// healthHandler checks database health and responds with status and timestamp
func healthHandler(w http.ResponseWriter, r *http.Request) {
	dbHealthy := checkDatabaseConnection();

	w.Header().Set("Content-Type", "application/json")

	if dbHealthy {
		w.WriteHeader(http.StatusOK)
		response := fmt.Sprintf(`{"status":"ok","timestamp":"%s"}`, formatTimestamp(time.Now()))
		w.Write([]byte(response))
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status":"unhealthy"}`))
	}
}