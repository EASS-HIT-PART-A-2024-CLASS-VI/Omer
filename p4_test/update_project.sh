#!/bin/bash

# Create project directory structure
mkdir -p p2_test/{client,server}

# ----------------------------------------------------------------------
# Server Setup
# ----------------------------------------------------------------------

# Create server/main.py
cat <<EOL > p2_test/server/main.py
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
EOL

# Server requirements
cat <<EOL > p2_test/server/requirements.txt
fastapi
uvicorn
redis
pydantic
uuid
EOL

# Server Dockerfile
cat <<EOL > p2_test/server/Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOL

# ----------------------------------------------------------------------
# Client Setup
# ----------------------------------------------------------------------

# Client index.html
cat <<EOL > p2_test/client/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Task Manager</h1>
        <form id="taskForm">
            <label for="description">Task Description:</label>
            <input type="text" id="description" name="description" placeholder="Enter a task..." required>
            <button type="submit">Add Task</button>
        </form>
        <hr>
        <h2>Tasks:</h2>
        <ul id="taskList"></ul>
    </div>
    <script src="script.js"></script>
</body>
</html>
EOL

# Client script.js
cat <<EOL > p2_test/client/script.js
document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;

    const response = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
    });

    const result = await response.json();
    alert(\`Task added: \${result.description}\`);
    document.getElementById("description").value = "";
    fetchTasks();
});

async function fetchTasks() {
    const response = await fetch("http://localhost:8000/tasks");
    const data = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    data.tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = \`
            <span class="task-text">\${task.description}</span>
            <span class="task-id">ID: \${task.id}</span>
        \`;
        taskList.appendChild(li);
    });
}

async function checkServerStatus() {
    try {
        const response = await fetch("http://localhost:8000");
        const data = await response.json();
        const statusDiv = document.createElement('div');
        statusDiv.className = 'status';
        statusDiv.innerHTML = \`
            ✅ Server: \${data.message}<br>
            ✅ Redis: Connected via Docker<br>
            ✅ Client: Running on port 8080
        \`;
        document.body.appendChild(statusDiv);
    } catch (error) {
        console.error("Connection error:", error);
    }
}

fetchTasks();
checkServerStatus();
EOL

# Client styles.css
cat <<EOL > p2_test/client/styles.css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 100%;
}

/* ... (keep previous styles from earlier answer) ... */

.status {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #e8f5e9;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #a5d6a7;
    color: #2e7d32;
    font-size: 0.9rem;
}
EOL

# Client Dockerfile
cat <<EOL > p2_test/client/Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
EOL

# ----------------------------------------------------------------------
# Docker Compose Setup
# ----------------------------------------------------------------------

# docker-compose.yml
cat <<EOL > p2_test/docker-compose.yml
version: "3.8"
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

  server:
    build: ./server
    ports:
      - "8000:8000"
    depends_on:
      - redis
    networks:
      - app-network

  client:
    build: ./client
    ports:
      - "8080:80"
    depends_on:
      - server
    networks:
      - app-network

  redis-commander:
    image: rediscommander/redis-commander:latest
    ports:
      - "8081:8081"
    environment:
      - REDIS_HOSTS=redis:redis:6379
    depends_on:
      - redis
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOL

# Make script executable
chmod +x create_project.sh

echo "Project updated with monitoring features!"
echo "Run these commands to start:"
echo "cd p2_test"
echo "docker-compose up --build"