import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import About from './components/About';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (taskData) => {
    try {
      console.log('Submitting task data:', taskData);
      let response;
      if (editingTask) {
        console.log('Updating existing task:', editingTask.id);
        response = await axios.put(`http://localhost:8000/tasks/${editingTask.id}`, {
          ...editingTask,
          ...taskData,
          is_completed: editingTask.is_completed
        });
        console.log('Task updated successfully:', response.data);
      } else {
        console.log('Creating new task');
        response = await axios.post('http://localhost:8000/tasks', taskData);
        console.log('Task created successfully:', response.data);
      }
      
      // Only proceed if we have a successful response
      if (response && response.data) {
        setEditingTask(null);
        localStorage.removeItem('editingTask');
        await fetchTasks();  // Wait for tasks to be fetched
        return true;  // Indicate success
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to save task. Please try again.');
      return false;  // Indicate failure
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    localStorage.setItem('editingTask', JSON.stringify(task));
  };

  // Load editing task from localStorage on component mount
  useEffect(() => {
    const savedTask = localStorage.getItem('editingTask');
    if (savedTask) {
      setEditingTask(JSON.parse(savedTask));
    }
  }, []);

  const handleStatusChange = async (taskId, isCompleted) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        is_completed: isCompleted
      };

      await axios.put(`http://localhost:8000/tasks/${taskId}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await axios.delete(`http://localhost:8000/tasks/${taskId}`);
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <TaskList
              tasks={tasks}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          }
        />
        <Route
          path="/create"
          element={
            <CreateTask
              onSubmit={handleSubmit}
            />
          }
        />
        <Route
          path="/edit"
          element={
            <EditTask
              onSubmit={handleSubmit}
              editingTask={editingTask}
              onCancel={() => {
                setEditingTask(null);
                localStorage.removeItem('editingTask');
              }}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App; 