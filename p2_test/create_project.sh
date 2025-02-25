#!/bin/bash

# Create project directory structure
mkdir -p project/{client,server}

# Create server files
cat <<EOL > project/server/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from redis import Redis
from fastapi.middleware.cors import CORSMiddleware

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
class Item(BaseModel):
    key: str
    value: str

@app.get("/data/{key}")
def get_data(key: str):
    value = redis.get(key)
    if value:
        return {"key": key, "value": value.decode("utf-8")}
    raise HTTPException(status_code=404, detail="Key not found")

@app.post("/data")
def post_data(item: Item):
    redis.set(item.key, item.value)
    return {"message": "Data stored successfully", "key": item.key, "value": item.value}
EOL

cat <<EOL > project/server/requirements.txt
fastapi
uvicorn
redis
pydantic
EOL

cat <<EOL > project/server/Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EOL

# Create client files
cat <<EOL > project/client/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FastAPI + Redis Client</title>
</head>
<body>
    <h1>FastAPI + Redis Client</h1>
    <form id="postForm">
        <label for="key">Key:</label>
        <input type="text" id="key" name="key" required>
        <label for="value">Value:</label>
        <input type="text" id="value" name="value" required>
        <button type="submit">Store Data</button>
    </form>
    <hr>
    <form id="getForm">
        <label for="getKey">Key:</label>
        <input type="text" id="getKey" name="key" required>
        <button type="submit">Retrieve Data</button>
    </form>
    <h2>Result:</h2>
    <p id="result"></p>
    <script src="script.js"></script>
</body>
</html>
EOL

cat <<EOL > project/client/script.js
document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;

    const response = await fetch("http://localhost:8000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
    });

    const result = await response.json();
    document.getElementById("result").innerText = JSON.stringify(result, null, 2);
});

document.getElementById("getForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = document.getElementById("getKey").value;

    const response = await fetch(\`http://localhost:8000/data/\${key}\`);
    const result = await response.json();
    document.getElementById("result").innerText = JSON.stringify(result, null, 2);
});
EOL

cat <<EOL > project/client/Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
EOL

# Create docker-compose.yml
cat <<EOL > project/docker-compose.yml
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

echo "Project created successfully! Navigate to the 'project' directory and run 'docker-compose up --build' to start the application."