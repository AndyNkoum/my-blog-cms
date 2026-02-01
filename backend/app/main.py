from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, database

# This line creates the tables in the database automatically
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "online", "database": "connected"}