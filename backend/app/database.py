from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from pathlib import Path


env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Debugging print (This will show up in your terminal so we know what's happening)
print(f"DEBUG: Looking for .env at: {env_path}")
print(f"DEBUG: Found Database URL: {SQLALCHEMY_DATABASE_URL is not None}")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError(f"DATABASE_URL is not set. Checked file: {env_path}")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()