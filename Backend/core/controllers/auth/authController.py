"""
Controller for authentication and user management.
"""
from fastapi import HTTPException
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from utils.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from core.db.database import SessionLocal, engine, Base
from core.db.models.user_details import UserDetails


class AuthService:

    def __init__(self, db: Session):
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against a hashed password.
        """
        try:
            return self.pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Password verification error")


    def get_password_hash(self, password: str) -> str:
        """
        Hash a plain password.
        """
        try:
            return self.pwd_context.hash(password)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Password hashing error")


    def get_user_by_username(self, username: str) -> Optional[UserDetails]:
        """
        Get a user by username.
        """
        try:
            return self.db.query(UserDetails).filter(UserDetails.username == username).first()
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail="Database error")


    def authenticate_user(self, username: str, password: str) -> Optional[UserDetails]:
        """
        Authenticate a user by username and password.
        """
        try:
            user = self.get_user_by_username(username)
            if not user or not self.verify_password(password, user.hashed_password):
                return None
            return user
        except Exception as e:
            raise HTTPException(status_code=500, detail="Authentication error")


    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create a JWT access token.
        """
        try:
            to_encode = data.copy()
            expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
            to_encode.update({"exp": expire})
            return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Token creation error")


    def create_user(self, username: str, password: str, email: str, full_name: Optional[str] = None) -> UserDetails:
        """
        Create a new user.
        """
        try:
            hashed_password = self.get_password_hash(password)
            new_user = UserDetails(username=username, hashed_password=hashed_password, email=email, full_name=full_name)
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
            return new_user
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail="Database error")


# Create database tables
Base.metadata.create_all(bind=engine)