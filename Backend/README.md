Sure, I'll provide a line-by-line explanation for each of the three files.

main.py

-> from fastapi import FastAPI
Import the FastAPI class from the fastapi module to create a FastAPI application.


-> from api.v1.routes.authRoute import auth_router
Import the router object from the authRoute module and alias it as auth_router.


-> app = FastAPI()
Create an instance of the FastAPI application.


-> app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
Include the auth_router in the FastAPI application with the prefix /api/v1/auth and tag it as auth.


-> if __name__ == "__main__":
Check if the script is being run directly (not imported as a module).


->     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
Import the uvicorn module, which is an ASGI server for running FastAPI applications.


-> from passlib.context import CryptContext
Run the FastAPI application using uvicorn on host 0.0.0.0 and port 8000 with auto-reload enabled.



authController.py

-> import jwt
Import CryptContext from the passlib library for password hashing.

-> 
Import the jwt library for creating and decoding JSON Web Tokens.

-> from datetime import datetime, timedelta
Import datetime and timedelta classes for handling date and time operations.

-> from typing import Optional
Import Optional from the typing module for type hinting optional parameters.

-> SECRET_KEY = "your_secret_key"
Define a secret key for encoding and decoding JWT tokens.

-> ALGORITHM = "HS256"
Define the algorithm used for encoding JWT tokens.

-> ACCESS_TOKEN_EXPIRE_MINUTES = 30
Define the expiration time for access tokens in minutes.

-> pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
Create a password hashing context using the bcrypt algorithm.

-> fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": pwd_context.hash("secret"),
        "disabled": False,
    }
}
Define a fake user database with a single user for demonstration purposes.

->def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
Define a function to verify a plain password against a hashed password.

-> def get_password_hash(password):
    return pwd_context.hash(password)
Define a function to hash a plain password.


def get_user(username: str):
    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return user_dict
    return None
Define a function to retrieve a user from the fake user database by username.


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user
Define a function to authenticate a user by verifying the username and password.


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
Define a function to create a JWT access token with an optional expiration time.



authRoute.py

-> Personal\Expertise\Development\GenTech\Backend\api\v1\routes\authRoute.py
from fastapi import APIRouter, Depends, HTTPException, status
Import APIRouter, Depends, HTTPException, and status from the fastapi module.

-> from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
Import OAuth2PasswordBearer and OAuth2PasswordRequestForm for handling OAuth2 authentication.

-> import jwt
Import the jwt library for creating and decoding JSON Web Tokens.

-> from datetime import timedelta
Import timedelta for handling time durations.

-> from api.v1.controllers.authController import authenticate_user, create_access_token, get_user
Import authenticate_user, create_access_token, and get_user functions from the authController module.

-> SECRET_KEY = "your_secret_key"
Define a secret key for encoding and decoding JWT tokens.

-> ALGORITHM = "HS256"
Define the algorithm used for encoding JWT tokens.

-> ACCESS_TOKEN_EXPIRE_MINUTES = 30
Define the expiration time for access tokens in minutes.

-> oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
Create an OAuth2 password bearer token dependency.

-> router = APIRouter()
Create an instance of the FastAPI APIRouter.


@router.post("/token", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
Define a POST endpoint /token to handle user login and return an access token. It uses the OAuth2PasswordRequestForm to get the username and password, authenticates the user, and returns a JWT token if successful.


@router.get("/users/me", response_model=dict)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = get_user(username)
    if user is None:
        raise credentials_exception
    return user

Define a GET endpoint /users/me to retrieve the current user's information. It uses the OAuth2 token to get the user's details and returns the user information if the token is valid.