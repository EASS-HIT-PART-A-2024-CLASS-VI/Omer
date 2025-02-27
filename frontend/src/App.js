import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import About from './components/About';
import './styles/App.css';

// TaskDetails component to show individual task
function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tasks/${id}`);
        setTask(response.data);
        setLoading(false);
      } catch (error) {
        setError('Task not found');
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await axios.delete(`http://localhost:8000/tasks/${id}`);
        navigate('/');
      }
    } catch (error) {
      setError('Failed to delete task');
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!task) return <div className="container">Task not found</div>;

  return (
    <div className="container">
      <h1>{task.title}</h1>
      <div className="task-details">
        <p><strong>ID:</strong> {task.id}</p>
        <p><strong>Description:</strong> {task.description || 'No description'}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Status:</strong> {task.is_completed ? 'Completed' : 'Pending'}</p>
        {task.start_time && <p><strong>Start Time:</strong> {new Date(task.start_time).toLocaleString()}</p>}
        {task.end_time && <p><strong>End Time:</strong> {new Date(task.end_time).toLocaleString()}</p>}
        {task.duration && <p><strong>Duration:</strong> {task.duration} minutes</p>}
        <p><strong>Created At:</strong> {new Date(task.created_at).toLocaleString()}</p>
      </div>
      <div className="task-actions">
        <button onClick={() => navigate('/')} className="back-button">Back to List</button>
        <button onClick={() => navigate('/edit')} className="edit-button">Edit Task</button>
        <button onClick={handleDelete} className="delete-button">Delete Task</button>
      </div>
    </div>
  );
}

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
      // Convert taskId to string to match server's format
      const stringId = String(taskId);
      const taskToUpdate = tasks.find(t => t.id === stringId);
      if (!taskToUpdate) return;

      const updatedTask = {
        ...taskToUpdate,
        is_completed: isCompleted
      };

      await axios.put(`http://localhost:8000/tasks/${stringId}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        // Convert taskId to string to match server's format
        const stringId = String(taskId);
        await axios.delete(`http://localhost:8000/tasks/${stringId}`);
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
        <Route path="/" element={<TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />} />
        <Route path="/tasks" element={<TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/create" element={<CreateTask onSubmit={(taskData) => handleSubmit(taskData, false)} />} />
        <Route path="/edit" element={<EditTask onSubmit={(taskData) => handleSubmit(taskData, true)} editingTask={editingTask} onCancel={() => { setEditingTask(null); localStorage.removeItem('editingTask'); }} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App; 