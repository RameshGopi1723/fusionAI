from sqlalchemy import Column, Integer, String, Boolean
from core.db.database import Base

class UserDetails(Base):
    __tablename__ = "user_detail"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100))
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    disabled = Column(Boolean, default=False)