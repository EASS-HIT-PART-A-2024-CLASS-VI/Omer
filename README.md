# Task Manager Application

A modern task management application built with React, FastAPI, and Redis.

## Features

- Create, read, update, and delete tasks
- Set task priority levels (1-5)
- Mark tasks as completed
- Sort tasks by date, title, or priority
- Schedule tasks with start and end times
- Track task duration
- Modern and responsive UI

## Prerequisites

- Docker and Docker Compose
- Git

## Quick Start

1. Clone the repository:
```bash
git clone <your-repo-url>
cd task-manager
```

2. Start the application:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Redis Commander: http://localhost:8081

## Development Setup

### Frontend (React)

The frontend is built with React and includes:
- React Router for navigation
- Axios for API calls
- React DatePicker for date/time selection
- Modern CSS with responsive design

To run the frontend separately:
```bash
cd frontend
npm install
npm start
```

### Backend (FastAPI)

The backend uses FastAPI and includes:
- RESTful API endpoints
- Redis database integration
- CORS configuration
- Data validation with Pydantic

To run the backend separately:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Database (Redis)

Redis is used as the primary database:
- Stores tasks with unique IDs
- Maintains task order
- Provides fast read/write operations

## API Endpoints

- GET /tasks - Get all tasks
- POST /tasks - Create a new task
- PUT /tasks/{task_id} - Update a task
- DELETE /tasks/{task_id} - Delete a task
- GET /health/redis - Check Redis connection

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
REDIS_HOST=redis
REDIS_PORT=6379
```

## Docker Configuration

The application uses Docker Compose with three services:
1. Frontend (React)
2. Backend (FastAPI)
3. Redis
4. Redis Commander (for database management)

## Integration Tests

The project includes comprehensive integration tests to ensure all components work together seamlessly.

### Test Coverage

- API Endpoints interaction
- Redis data persistence
- Frontend-Backend communication
- Error handling and edge cases

### Running Tests

Using Docker:
```bash
cd Final_ver1
docker-compose run integration_test
```

Local environment:
```bash
cd Final_ver1/integration_tests
pytest integration_test.py
```

### Test Structure

Tests are located in `integration_tests/integration_test.py` and cover:
- Task creation and validation
- Task updates and state changes
- Data persistence verification
- Error handling scenarios
- API response validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Author

Omer Trabulski