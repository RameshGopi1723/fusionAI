# filepath: d:\Personal\Expertise\Development\GenTech\Backend\tests\test_auth.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.v1.auth.authRoute import auth_router
from core.db.database import Base, get_db
from fastapi import FastAPI
from sqlalchemy.exc import SQLAlchemyError

# Create a new FastAPI app for testing
app = FastAPI()
app.include_router(auth_router)

# Create a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

# Dependency override
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_register_user_success():
    response = client.post(
        "/register",
        json={"username": "testuser", "password": "testpass", "email": "test@example.com", "full_name": "Test User"},
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_register_user_already_registered():
    client.post(
        "/register",
        json={"username": "testuser", "password": "testpass", "email": "test@example.com", "full_name": "Test User"},
    )
    response = client.post(
        "/register",
        json={"username": "testuser", "password": "testpass", "email": "test@example.com", "full_name": "Test User"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_register_user_db_error(monkeypatch):
    def mock_create_user(*args, **kwargs):
        raise SQLAlchemyError("Database error")

    monkeypatch.setattr("api.v1.controllers.authController.AuthService.create_user", mock_create_user)

    response = client.post(
        "/register",
        json={"username": "testuser", "password": "testpass", "email": "test@example.com", "full_name": "Test User"},
    )
    assert response.status_code == 500
    assert response.json()["detail"] == "Database error"