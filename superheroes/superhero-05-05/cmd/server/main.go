package main

import (
	"github.com/FEUP-MEIC-DS-2024-25/T05_G04/internal/api"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	api.SetupRoutes(r)
	r.Run(":8080")
}
