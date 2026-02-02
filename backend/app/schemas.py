from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- Post Schemas ---
class PostBase(BaseModel):
    title: str
    content: str
    slug: str
    published: bool = False

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id: int
    created_at: datetime
    author_id: int

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    posts: List[PostResponse] = []

    class Config:
        from_attributes = True