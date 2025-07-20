# backend/app/controllers/auth_user.py
import jwt

payload_data = {
    "sub": "4242",
    "name": "Jessica Temporal",
    "nickname": "Jess"
}
my_secret = 'my_super_secret'

class AuthController:
    def __init__(self):
        # Здесь вы могли бы инициализировать что-то, например, подключение к БД
        pass

    async def register_user(self, username: str, password: str):
        """
        Пример метода контроллера для регистрации нового пользователя.
        """
        print("авав")
        # В реальном приложении здесь будет логика сохранения пользователя в БД,
        # хеширование пароля и т.д.
        print(f"User {username} registered with password (hashed) {password}")
        token = jwt.encode(payload=payload_data, key=my_secret)

        return {"message": f"User {username} registered successfully", "token": f"{token}"}

    async def login_user(self, username: str, password: str):
        """
        Пример метода контроллера для входа пользователя.
        """
        # В реальном приложении здесь будет логика проверки учетных данных
        if username == "testuser" and password == "testpass":
            return {"message": "Login successful", "token": "fake-jwt-token"}
        return {"message": "Invalid credentials"}, 401 # FastAPI может вернуть status_code

    async def get_user_profile(self, user_id: int):
        """
        Пример метода контроллера для получения профиля пользователя.
        """
        return {"user_id": user_id, "username": f"user_{user_id}", "email": f"user{user_id}@example.com"}