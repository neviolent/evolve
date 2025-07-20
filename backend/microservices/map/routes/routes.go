package routes

import (
	"net/http"

	"politsim/controllers"
	//"politsim/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello world!"})
	})

	authGroup := r.Group("/api/auth")
	{
		authGroup.POST("/register", controllers.RegisterUser)
		authGroup.POST("/login", controllers.LoginUser)
		authGroup.POST("/logout", controllers.LogoutUser)
		authGroup.GET("/validate-token", controllers.TokenValidation)
		// API группа с обязательной авторизацией
		//apiGroup := r.Group("/api")
		//apiGroup.Use(middlewares.AuthRequired())
		//{

		//}
		// Публичные цитаты (без авторизации)
		//publicGroup := r.Group("/api/auth/public")
		//{
		//}
	}
}
