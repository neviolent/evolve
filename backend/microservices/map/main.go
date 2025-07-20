package main

import (
	"politsim/database"
	"politsim/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r = gin.Default()

func main() {
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
	}))
	database.ConnectDatabase()
	routes.SetupRoutes(r)
	r.Run(":8002")
}
