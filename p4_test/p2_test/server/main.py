from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from redis import Redis
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Connect to Redis
redis = Redis(host="redis", port=6379, db=0)

# Pydantic model for POST request
class Task(BaseModel):
    description: str

@app.get("/")
def read_root():
    return {"message": "Server is running!"}

@app.get("/tasks")
def get_tasks():
    tasks = []
    for key in redis.keys():
        task = redis.hgetall(key)
        tasks.append({"id": key.decode("utf-8"), "description": task[b"description"].decode("utf-8")})
    return {"tasks": tasks}

@app.post("/tasks")
def add_task(task: Task):
    task_id = str(uuid.uuid4())
    redis.hset(task_id, mapping={"description": task.description})
    return {"message": "Task added successfully", "id": task_id, "description": task.description}
