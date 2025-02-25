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

  useEffect(() => {
    fetchTasks();
    // Clear any stored editing task on component mount
    localStorage.removeItem('editingTask');
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (taskData, isEditing = false) => {
    try {
      if (isEditing && editingTask) {
        // Update existing task
        await axios.put(`http://localhost:8000/tasks/${editingTask.id}`, {
          ...editingTask,
          ...taskData
        });
      } else {
        // Create new task
        await axios.post('http://localhost:8000/tasks', taskData);
      }
      setEditingTask(null);
      localStorage.removeItem('editingTask');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    localStorage.setItem('editingTask', JSON.stringify(task));
  };

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
              onSubmit={(taskData) => handleSubmit(taskData, false)}
            />
          }
        />
        <Route
          path="/edit"
          element={
            <EditTask
              onSubmit={(taskData) => handleSubmit(taskData, true)}
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