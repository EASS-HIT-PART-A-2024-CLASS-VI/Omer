#!/bin/bash

# Create project directory structure
mkdir -p p2_test/{client,server}

# Create server files
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
    allow_origins=["*"],  # Allow all origins (for development only)
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Connect to Redis
redis = Redis(host="redis", port=6379, db=0)

# Pydantic model for POST request
class Task(BaseModel):
    description: str

@app.get("/tasks")
def get_tasks():
    tasks = []
    for key in redis.keys():
        task = redis.hgetall(key)
        tasks.append({"id": key.decode("utf-8"), "description": task[b"description"].decode("utf-8")})
    return {"tasks": tasks}

@app.post("/tasks")
def add_task(task: Task):
    task_id = str(uuid.uuid4())  # Generate a unique ID
    redis.hset(task_id, mapping={"description": task.description})
    return {"message": "Task added successfully", "id": task_id, "description": task.description}
EOL

cat <<EOL > p2_test/server/requirements.txt
fastapi
uvicorn
redis
pydantic
uuid
EOL

cat <<EOL > p2_test/server/Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOL

# Create client files
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
    document.getElementById("description").value = ""; // Clear input
    fetchTasks(); // Refresh task list
});

async function fetchTasks() {
    const response = await fetch("http://localhost:8000/tasks");
    const data = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    data.tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = \`
            <span class="task-text">\${task.description}</span>
            <span class="task-id">ID: \${task.id}</span>
        \`;
        taskList.appendChild(li);
    });
}

// Fetch tasks on page load
fetchTasks();
EOL

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

h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #6200ea;
    text-align: center;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #555;
}

input {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 1rem;
}

button {
    padding: 0.75rem;
    font-size: 1rem;
    background-color: #6200ea;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #3700b3;
}

hr {
    border: 0;
    height: 1px;
    background: #ddd;
    margin: 1.5rem 0;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #6200ea;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background: #f9f9f9;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.task-text {
    font-size: 1rem;
    color: #333;
}

.task-id {
    font-size: 0.875rem;
    color: #777;
}
EOL

cat <<EOL > p2_test/client/Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
EOL

# Create docker-compose.yml
cat <<EOL > p2_test/docker-compose.yml
version: "3.8"
services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
  server:
    build: ./server
    ports:
      - "8000:8000"
    depends_on:
      - redis
  client:
    build: ./client
    ports:
      - "8080:80"
    depends_on:
      - server
EOL

# Make the script executable
chmod +x create_project.sh

echo "Task Manager project created successfully! Navigate to the 'p2_test' directory and run 'docker-compose up --build' to start the application."