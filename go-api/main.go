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

var dbpool *pgxpool.Pool // Reference pointer to connection pool

func main() {
	// Load environment variables from .env file
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Println("No .env.local file foumd. Proceeding with environment variables.")
	}

	// Parse DB port
	dbPortStr := os.Getenv("DB_PORT")
	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		log.Fatalf("Invalid DB_PORT: %v", err)
	}

	// Create default, empty pgxpool.Config struct to customize programmatically
	config, err := pgxpool.ParseConfig("")
	if err != nil {
		log.Fatalf("Failed to create pgxpool config: %v", err)
	}

	// Build pgxpool config from env variables
	config.ConnConfig.Host = os.Getenv("DB_HOST")
	config.ConnConfig.Port = uint16(dbPort)
	config.ConnConfig.User = os.Getenv("DB_USER")
	config.ConnConfig.Password = os.Getenv("DB_PASSWORD")
	config.ConnConfig.Database = os.Getenv("DB_NAME")

	// Connect to the DB
	ctx := context.Background()
	dbpool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbpool.Close()

	// Set HTTP server port
	const port = 8080

	// Define HTTP handlers
	http.HandleFunc("/ping", pingHandler)
	http.HandleFunc("/", timeHandler)

	fmt.Printf("Server is running on port %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

// No need to pass Request struct for every request, passing pointer is sufficient
func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}

func timeHandler(w http.ResponseWriter, r *http.Request) {
	var currentTime time.Time
	err := dbpool.QueryRow(context.Background(), "SELECT NOW()").Scan(&currentTime)
	if err != nil {
		log.Printf("Error querying the database: %v", err)
		http.Error(w, "Error querying the time", http.StatusInternalServerError)
		return
	}
	
	formattedTime := currentTime.UTC().Format("2006-01-02T15:04:05.000Z")
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(fmt.Sprintf(`{"currentTime":"%s"}`, formattedTime)))
}