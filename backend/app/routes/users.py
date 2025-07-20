from fastapi import APIRouter
from ..controllers.auth_user import AuthController
from ..models.users import UserCreate
import secrets

router = APIRouter()
auth_controller = AuthController()

@router.get("/auth/{test}")
async def test_arg(test: int):
    return await auth_controller.read_item(test)

@router.post("/auth/register")
async def register(user: UserCreate):
    secret_key = secrets.token_urlsafe(32)
    print(secret_key)
    return await auth_controller.register_user(user.username, user.password)

@router.post("/auth/login")
async def register(user: UserCreate):
    return await auth_controller.register_user(user.username, user.password)