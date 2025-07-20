# config.py
from dotenv import load_dotenv
import os

load_dotenv()  # загружаем переменные из .env

SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
