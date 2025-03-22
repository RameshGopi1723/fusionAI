from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from core.controllers.auth.authController import AuthService
from utils.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from core.db.database import get_db
from api.v1.auth.authSchema import UserResponse, UserCreate
from utils.dependency.decorators import Protected_Route

# OAuth2 password bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

auth_router = APIRouter()


@auth_router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    """
    auth_service = AuthService(db)
    try:
        db_user = auth_service.get_user_by_username(user.username)
        if db_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        new_user = auth_service.create_user(user.username, user.password, user.email, user.full_name)
        return new_user
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error")


@auth_router.post("/login", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login to get an access token.
    """
    auth_service = AuthService(db)
    try:
        user = auth_service.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth_service.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "Bearer"}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error")


@auth_router.get("/users/profile", response_model=UserResponse)
@Protected_Route
async def read_users_profile(request: Request, db: Session = Depends(get_db)):
    """
    Get current user details.
    """
    auth_service = AuthService(db)
    try:
        token = await oauth2_scheme(request)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = auth_service.get_user_by_username(username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Database error")
