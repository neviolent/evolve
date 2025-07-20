package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWT-секретный ключ (вынесешь потом в env если что)
var jwtKey = []byte("955b25474f6e88a4281f827ba178d1d72a070dd7ffa88059b7806a959e8442f93b0f2940de993b70f1611fa225ea2191ac26824f2864105b7552697b8ba3628f1aee708e2c6a3745308bbc5254a5559ad02e3a5e8a4ed479c48f0e94a370aa60d368c1f015b2901e7c6b06294727d06a137b4edc1d155609766fa43c4e661f0095d58372b874bac60d76dab82a89f21f3f284e97c956f830b53ba9565a23b3dcc9843e889357a6318d8c97695bd85d83550559b1ec3ea3ff5237847b9533073a3967dbf9cd39fda91a7bc50acaf84cecfbf55efbef3af9b9860bd10ecc69e600bdbe43bd1c1f11b4cfafa5f5e893ddc882a0e9d73d000e5cc5be47fb73e5413f")

type Claims struct {
	Username string `json:"username"`
	UserID   uint   `json:"user_id"`
	jwt.RegisteredClaims
}

// AuthRequired - middleware для проверки JWT токена
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authorization header"})
			c.Abort()
			return
		}

		// Убираем префикс "Bearer " если он есть
		tokenString := authHeader
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = authHeader[7:]
		}

		// Парсим токен
		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(*Claims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Сохраняем данные пользователя в контекст
		c.Set("username", claims.Username)
		c.Set("user_id", claims.UserID)
		c.Set("user", claims)

		c.Next()
	}
}

// AdminRequired - middleware для проверки прав администратора
func AdminRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Сначала проверяем авторизацию
		AuthRequired()(c)
		if c.IsAborted() {
			return
		}

		// Здесь можно добавить проверку роли администратора (если вдруг захочешь когда нибудь)
		// Например, из базы данных или из токена
		username, exists := c.Get("username")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		// Простая проверка (в реальном приложении лучше использовать роли в БД)
		if username != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// OptionalAuth - middleware для опциональной авторизации
func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		tokenString := authHeader
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = authHeader[7:]
		}

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err == nil && token.Valid {
			if claims, ok := token.Claims.(*Claims); ok {
				c.Set("username", claims.Username)
				c.Set("user_id", claims.UserID)
				c.Set("user", claims)
				c.Set("authenticated", true)
			}
		} else {
			c.Set("authenticated", false)
		}

		c.Next()
	}
}
