from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/hello")
async def say_hello():
    return {"message": "Привет, Раиль!"}

@router.get("/hello/war")
async def start_battle():
    async with httpx.AsyncClient() as client:
        # вызов GO-сервиса
        response = await client.get("http://localhost:8080/public/quotes/random")
        return response.json()