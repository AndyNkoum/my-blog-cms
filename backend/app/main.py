from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, database, schemas, auth

# . Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Add CORS (So Frontend can talk to Backend)
origins = [
    "http://localhost:3000",
    "https://andy-blog-api.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Database Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# auth endpoint

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email, 
        username=user.username, 
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

#  blog posts endpoints

@app.get("/posts", response_model=List[schemas.PostResponse])
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.published == True).offset(skip).limit(limit).all()
    return posts

@app.get("/posts/{slug}", response_model=schemas.PostResponse)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.slug == slug, models.Post.published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/posts/", response_model=schemas.PostResponse)
def create_post(
    post: schemas.PostCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if not post.slug:
        post.slug = post.title.lower().replace(" ", "-")
        
    new_post = models.Post(**post.dict(), author_id=current_user.id)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post