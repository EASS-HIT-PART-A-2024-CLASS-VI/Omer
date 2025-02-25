import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/CreateTask.css';

function CreateTask({ onSubmit }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        title,
        description,
        start_time: startTime?.toISOString(),
        end_time: endTime?.toISOString(),
        duration: duration ? parseInt(duration) : null,
        is_completed: false,
        priority: priority
      });
      navigate('/');
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  return (
    <div className="create-task-container">
      <h1>Create New Task</h1>
      
      <form onSubmit={handleSubmit} className="task-form">
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
          <label>Start Time (optional)</label>
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
          <label>End Time (optional)</label>
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
          <label>Duration (minutes, optional)</label>
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
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="form-control"
          >
            <option value={1}>1 - Not Important</option>
            <option value={2}>2 - Low Importance</option>
            <option value={3}>3 - Medium Importance</option>
            <option value={4}>4 - High Importance</option>
            <option value={5}>5 - Most Important</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Task
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask; 