import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/EditTask.css';

function EditTask({ onSubmit, editingTask, onCancel }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    const savedTask = editingTask || JSON.parse(localStorage.getItem('editingTask'));
    if (!savedTask) {
      navigate('/');
      return;
    }
    
    setTitle(savedTask.title || '');
    setDescription(savedTask.description || '');
    setStartTime(savedTask.start_time ? new Date(savedTask.start_time) : null);
    setEndTime(savedTask.end_time ? new Date(savedTask.end_time) : null);
    setDuration(savedTask.duration || '');
    setPriority(savedTask.priority || 1);
  }, [editingTask, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        title,
        description,
        start_time: startTime?.toISOString(),
        end_time: endTime?.toISOString(),
        duration: duration ? parseInt(duration) : null,
        priority,
        is_completed: editingTask?.is_completed || false
      });
      localStorage.removeItem('editingTask');
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleCancel = () => {
    onCancel();
    navigate('/');
  };

  return (
    <div className="edit-task-container">
      <div className="edit-task-header">
        <div className="edit-task-title">
          <h1>Edit Task</h1>
          {editingTask && <span className="task-id">ID: {editingTask.id}</span>}
        </div>
        <button className="back-button" onClick={handleCancel}>
          Back to Tasks
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="edit-task-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <DatePicker
            selected={startTime}
            onChange={date => setStartTime(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
            placeholderText="Select start date and time"
          />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <DatePicker
            selected={endTime}
            onChange={date => setEndTime(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
            placeholderText="Select end date and time"
            minDate={startTime}
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration in minutes"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value))}
            placeholder="Enter priority"
            min="1"
            max="5"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="update-button">
            Update Task
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTask; 