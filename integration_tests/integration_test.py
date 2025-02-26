import pytest
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

@pytest.fixture
def test_task():
    return {
        "title": "Test Task",
        "description": "Test Description",
        "priority": 1,
        "start_time": (datetime.now() + timedelta(hours=1)).isoformat(),
        "end_time": (datetime.now() + timedelta(hours=2)).isoformat()
    }

def test_redis_health():
    """Test Redis connection health check"""
    response = requests.get(f"{BASE_URL}/health/redis")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["connection_status"] == "connected"

def test_create_task(test_task):
    """Test task creation"""
    response = requests.post(f"{BASE_URL}/tasks", json=test_task)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == test_task["title"]
    assert data["description"] == test_task["description"]
    assert data["priority"] == test_task["priority"]
    return data["id"]

def test_get_all_tasks():
    """Test retrieving all tasks"""
    response = requests.get(f"{BASE_URL}/tasks")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_update_task(test_task):
    """Test task update"""
    # First create a task
    task_id = test_create_task(test_task)
    
    # Update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated Description",
        "priority": 2
    }
    response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["description"] == update_data["description"]
    assert data["priority"] == update_data["priority"]

def test_delete_task(test_task):
    """Test task deletion"""
    # First create a task
    task_id = test_create_task(test_task)
    
    # Delete the task
    response = requests.delete(f"{BASE_URL}/tasks/{task_id}")
    assert response.status_code == 200
    
    # Verify task is deleted
    response = requests.get(f"{BASE_URL}/tasks/{task_id}")
    assert response.status_code == 404

def test_task_completion(test_task):
    """Test marking a task as completed"""
    # Create a task
    task_id = test_create_task(test_task)
    
    # Mark as completed
    update_data = {"is_completed": True}
    response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] == True

def test_invalid_task_creation():
    """Test creating task with invalid data"""
    invalid_task = {
        "title": "",  # Empty title should be invalid
        "priority": 10  # Invalid priority level
    }
    response = requests.post(f"{BASE_URL}/tasks", json=invalid_task)
    assert response.status_code == 422  # Validation error

def test_task_duration():
    """Test task duration calculation"""
    task = {
        "title": "Duration Test",
        "description": "Testing duration calculation",
        "priority": 1,
        "start_time": datetime.now().isoformat(),
        "end_time": (datetime.now() + timedelta(hours=2)).isoformat()
    }
    response = requests.post(f"{BASE_URL}/tasks", json=task)
    assert response.status_code == 200
    data = response.json()
    assert "duration" in data
    assert data["duration"] is not None 