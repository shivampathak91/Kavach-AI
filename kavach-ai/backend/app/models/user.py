from sqlalchemy import Column, String, Boolean
from app.db.base import BaseModel
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    SECURITY_ANALYST = "security_analyst"
    USER = "user"


class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), nullable=False, default=UserRole.USER.value, index=True)
    is_active = Column(Boolean, default=True)
