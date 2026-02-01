from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime  # Helper for getting current time
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    content = Column(Text)
    published = Column(Boolean, default=False)
    
    # NOTICE: We use DateTime (uppercase) for the type, 
    # and datetime.utcnow (lowercase) for the default value.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")