from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import Database
from .models import TaskCreate, Task

app = FastAPI()

# Updated CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

db = Database()

@app.get("/health/redis")
async def check_redis_health():
    try:
        db.redis_client.ping()
        keys_count = len(db.redis_client.keys('*'))
        return {
            "status": "healthy",
            "total_keys": keys_count,
            "connection": "connected"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Redis connection error: {str(e)}")

@app.get("/tasks", response_model=list[Task])
async def get_tasks():
    return db.get_all_tasks()

@app.post("/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    return db.create_task(task)

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: str, task: TaskCreate):
    updated_task = db.update_task(task_id, task)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    success = db.delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"} 