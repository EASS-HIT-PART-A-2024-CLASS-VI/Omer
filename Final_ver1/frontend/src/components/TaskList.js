import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TaskList.css';

function TaskList({ tasks, isLoading, onEdit, onDelete, onStatusChange }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'priority'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const handleEdit = (task) => {
    onEdit(task);
    navigate('/edit');
  };

  const priorityLabels = {
    1: 'Not Important',
    2: 'Low Importance',
    3: 'Medium Importance',
    4: 'High Importance',
    5: 'Most Important'
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: '#6B7280', // Gray
      2: '#60A5FA', // Blue
      3: '#FCD34D', // Yellow
      4: '#F97316', // Orange
      5: '#EF4444'  // Red
    };
    return colors[priority];
  };

  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === 'title') {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortBy === 'priority') {
        return sortOrder === 'asc' 
          ? a.priority - b.priority
          : b.priority - a.priority;
      }
      return 0;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <div className="task-list-container">
      <h1 className="page-title">Task Manager</h1>
      
      <div className="task-list-header">
        <div className="header-actions">
          <button className="add-task-button" onClick={() => navigate('/create')}>
            Create New Task
          </button>
          <button className="about-button" onClick={() => navigate('/about')}>
            About
          </button>
        </div>
        {tasks.length > 0 && (
          <div className="sort-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button 
              onClick={toggleSortOrder} 
              className="sort-order-button"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loading-message">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks available. Create your first task!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {sortedTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                  {priorityLabels[task.priority]}
                </div>
                <label className="status-checkbox">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => onStatusChange(task.id, !task.is_completed)}
                  />
                  <span className="checkmark">
                    {task.is_completed ? '✓' : '✗'}
                  </span>
                </label>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              {task.start_time && (
                <p className="task-time">
                  Start: {new Date(task.start_time).toLocaleString()}
                </p>
              )}
              {task.end_time && (
                <p className="task-time">
                  End: {new Date(task.end_time).toLocaleString()}
                </p>
              )}
              {task.duration && (
                <p className="task-duration">
                  Duration: {task.duration} minutes
                </p>
              )}
              
              <div className="task-footer">
                <small>{new Date(task.created_at).toLocaleString()}</small>
                <div className="task-actions">
                  <button 
                    onClick={() => handleEdit(task)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button onClick={() => onDelete(task.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList; 