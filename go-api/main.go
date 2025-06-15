package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Println("No .env.local file foumd. Proceeding with environment variables.")
	}

	// Parse DB port
	port := os.Getenv("DB_PORT")
	dbPort, err := strconv.Atoi(port)
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
	dbpool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer dbpool.Close()

	fmt.Println("DB_HOST:", os.Getenv("DB_HOST"))
	fmt.Println("DB_PORT:", os.Getenv("DB_PORT"))
	fmt.Println("DB_USER:", os.Getenv("DB_USER"))
	fmt.Println("DB_PASSWORD:", os.Getenv("DB_PASSWORD"))
	fmt.Println("DB_NAME:", os.Getenv("DB_NAME"))

	fmt.Println("Connected to the Database!")
}