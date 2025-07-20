package models

import (
	"politsim/routes"

	"github.com/gin-gonic/gin"
)

var r = gin.Default()

func main() {
	routes.SetupRoutes(r)
	r.Run()
}
