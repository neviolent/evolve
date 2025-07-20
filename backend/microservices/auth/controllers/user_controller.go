package controllers

import (
	"net/http"
	"politsim/database"
	"politsim/models/db_models"
	"time"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// JWT-секретный ключ
var jwtKey = []byte("955b25474f6e88a4281f827ba178d1d72a070dd7ffa88059b7806a959e8442f93b0f2940de993b70f1611fa225ea2191ac26824f2864105b7552697b8ba3628f1aee708e2c6a3745308bbc5254a5559ad02e3a5e8a4ed479c48f0e94a370aa60d368c1f015b2901e7c6b06294727d06a137b4edc1d155609766fa43c4e661f0095d58372b874bac60d76dab82a89f21f3f284e97c956f830b53ba9565a23b3dcc9843e889357a6318d8c97695bd85d83550559b1ec3ea3ff5237847b9533073a3967dbf9cd39fda91a7bc50acaf84cecfbf55efbef3af9b9860bd10ecc69e600bdbe43bd1c1f11b4cfafa5f5e893ddc882a0e9d73d000e5cc5be47fb73e5413f")

// Структура для создания JWT
type Claims struct {
	Username string `json:"username"`
	UserID   uint   `json:"user_id"` // Добавляем ID пользователя
	jwt.RegisteredClaims
}

// Функция для хеширования пароля
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}

// Функция для проверки пароля
func checkPassword(storedPassword, inputPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(inputPassword))
	return err == nil
}

func validatePassword(password string) bool {
	length := utf8.RuneCountInString(password)
	return length >= 8 && length <= 128
}

// Регистрация пользователя
func RegisterUser(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ввод"})
		return
	}
	if input.Email == "" || input.Username == "" || input.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ввод"})
		return
	}
	if !validatePassword(input.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Пароль должен быть длиной от 8 до 128 символов!"})
		return
	}

	var existingUser db_models.User
	err := database.DB.Where("email = ? OR username = ?", input.Email, input.Username).First(&existingUser).Error
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Пользователь с таким email или именем уже существует"})
		return
	}

	hashedPassword, err := hashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось захешировать пароль"})
		return
	}

	newUser := db_models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: hashedPassword,
	}
	if err := database.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось зарегистрировать пользователя"})
		return
	}

	// ✅ Создаём токен сразу после регистрации
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: newUser.Username,
		UserID:   newUser.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось сгенерировать токен"})
		return
	}

	// ✅ Устанавливаем JWT в cookie
	c.SetCookie(
		"token",
		tokenString,
		3600*24,
		"/",
		"localhost",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Пользователь успешно зарегистрирован"})
}

// Логин пользователя с генерацией JWT
func LoginUser(c *gin.Context) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ввод"})
		return
	}

	var user db_models.User
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверное имя пользователя или пароль"})
		return
	}

	if !checkPassword(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный имя пользователя или пароль"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: user.Username,
		UserID:   user.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось сгенерировать токен"})
		return
	}

	// ✅ Устанавливаем JWT в HttpOnly cookie
	c.SetCookie(
		"token",
		tokenString,
		3600*24, // срок действия в секундах (1 день)
		"/",
		"localhost",
		false, // Secure (false для HTTP, true — если HTTPS)
		true,  // HttpOnly
	)

	c.JSON(http.StatusOK, gin.H{
		"message": "Вход выполнен успешно",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

func LogoutUser(c *gin.Context) {
	// Очищаем cookie, устанавливая его с истекшим сроком
	c.SetCookie(
		"token",
		"",
		-1, // Отрицательное время = cookie истекает немедленно
		"/",
		"",    // domain
		false, // secure
		true,  // httpOnly
	)

	c.JSON(http.StatusOK, gin.H{"message": "Выход выполнен успешно"})
}

// Функция для авторизации пользователя с JWT
func TokenValidation(c *gin.Context) {
	tokenString, err := c.Cookie("token")
	if err != nil || tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Отсутствует токен в cookie"})
		return
	}

	// Проверяем и парсим токен
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный токен"})
		return
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверные данные токена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Токен действителен",
		"username": claims.Username,
		"user_id":  claims.UserID,
	})
}
