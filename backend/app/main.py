from fastapi import FastAPI
from app.routes import hello
from app.routes import users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My FastAPI App")

# Разрешенные источники
origins = [
    "http://localhost:3000",  # фронтенд на React
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(hello.router)
app.include_router(users.router)
