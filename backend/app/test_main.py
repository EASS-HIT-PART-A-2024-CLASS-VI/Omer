from fastapi.testclient import TestClient
import sys
import os
import pytest
from redis import Redis

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import Database

# Override Redis configuration for testing
@pytest.fixture(autouse=True)
def override_redis():
    # Store original dependency overrides
    original_overrides = app.dependency_overrides.copy()
    
    # Create test database with Docker service name
    test_db = Database(host='redis', port=6379)  # Use 'redis' as host since we're in Docker network
    app.dependency_overrides[Database] = lambda: test_db
    
    yield
    
    # Restore original dependency overrides
    app.dependency_overrides = original_overrides

client = TestClient(app)

def test_read_main():
    response = client.get("/health/redis")
    assert response.status_code == 200

def test_create_task():
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "priority": 1,
        "start_time": "2024-02-26T10:00:00",
        "end_time": "2024-02-26T11:00:00"
    }
    response = client.post("/tasks", json=task_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]

def test_get_tasks():
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list) 