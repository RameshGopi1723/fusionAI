"""
Configuration file for environment variables and constants.
"""

from dotenv import load_dotenv
import os

load_dotenv()

#JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

#API_PREFIX
FUSION_AI_API_PREFIX = os.getenv("FUSION_AI_API_PREFIX", "/api/v1")

#DATABASE_URL
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:Krish%401723@localhost/fusion_ai")