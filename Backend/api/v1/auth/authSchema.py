from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    """
    Pydantic model for user creation.
    """
    username: str
    password: str
    email: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    """
    Pydantic model for user response.
    """
    username: str
    email: str
    full_name: Optional[str] = None

    class Config:
        from_attributes = True