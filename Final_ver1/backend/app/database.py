import redis
import json
import os
from datetime import datetime
from .models import Task

class Database:
    def __init__(self, host=None, port=6379):
        # In Docker, services can communicate using service names
        self.redis_client = redis.Redis(
            host=host or os.getenv('REDIS_HOST', 'redis'),  # Default to 'redis' for Docker
            port=port,
            decode_responses=True,
            db=0,  # Use default database
            charset="utf-8"
        )
        
    def initialize_db(self):
        """Initialize counter if it doesn't exist"""
        if not self.redis_client.exists('task_id_counter'):
            self.redis_client.set('task_id_counter', 0)
    
    def get_all_tasks(self):
        self.initialize_db()
        tasks = []
        for key in self.redis_client.keys('task:*'):
            task_data = json.loads(self.redis_client.get(key))
            # Convert string dates back to datetime objects
            if task_data.get('start_time'):
                task_data['start_time'] = datetime.fromisoformat(task_data['start_time'])
            if task_data.get('end_time'):
                task_data['end_time'] = datetime.fromisoformat(task_data['end_time'])
            if task_data.get('created_at'):
                task_data['created_at'] = datetime.fromisoformat(task_data['created_at'])
            tasks.append(Task(**task_data))
        return sorted(tasks, key=lambda x: x.created_at, reverse=True)
    
    def create_task(self, task_data):
        task_id = str(self.redis_client.incr('task_id_counter'))
        task = {
            **task_data.dict(),
            "id": task_id,
            "created_at": datetime.now().isoformat(),
            "start_time": task_data.start_time.isoformat() if task_data.start_time else None,
            "end_time": task_data.end_time.isoformat() if task_data.end_time else None,
            "is_completed": task_data.is_completed,
            "priority": task_data.priority
        }
        self.redis_client.set(f'task:{task_id}', json.dumps(task))
        return Task(**task)
    
    def update_task(self, task_id: str, task_data):
        if not self.redis_client.exists(f'task:{task_id}'):
            return None
        
        existing_task = json.loads(self.redis_client.get(f'task:{task_id}'))
        updated_task = {
            **existing_task,
            **task_data.dict(exclude_unset=True),
            "start_time": task_data.start_time.isoformat() if task_data.start_time else None,
            "end_time": task_data.end_time.isoformat() if task_data.end_time else None
        }
        
        self.redis_client.set(f'task:{task_id}', json.dumps(updated_task))
        return Task(**updated_task)
    
    def delete_task(self, task_id: str):
        if not self.redis_client.exists(f'task:{task_id}'):
            return False
        self.redis_client.delete(f'task:{task_id}')
        return True 