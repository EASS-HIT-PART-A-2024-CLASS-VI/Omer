#!/bin/bash

echo "Running Backend Tests..."
cd backend
python -m pytest -v
cd ..

echo -e "\nRunning Frontend Tests..."
cd frontend
npm test -- --watchAll=false
cd ..

echo -e "\nAll tests completed!" 