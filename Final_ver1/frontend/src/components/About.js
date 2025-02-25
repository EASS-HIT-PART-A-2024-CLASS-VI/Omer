import React from 'react';
import '../styles/About.css';
import taskManagerLogo from '../images/task-manager-logo.png';
import reactLogo from '../images/react-logo.png';
import fastapiLogo from '../images/fastapi-logo.png';
import redisLogo from '../images/redis-logo.png';
import dockerLogo from '../images/docker-logo.png';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <img 
          src={taskManagerLogo}
          alt="Task Manager Logo" 
          className="about-logo" 
        />
        <h1>About Task Manager</h1>

        <p className="intro">
          Welcome to Task Manager! This simple and intuitive application is designed 
          to help you organize your tasks efficiently and stay on top of your to-dos.
        </p>

        <h2>Key Features:</h2>
        <ul className="features-list">
          <li><strong>Create and Manage Tasks:</strong> Easily add new tasks with titles and descriptions.</li>
          <li><strong>View Task List:</strong> See all your tasks in a clear and organized list.</li>
          <li><strong>Prioritize Tasks:</strong> Assign priority levels (1-5) to focus on what's most important.</li>
          <li><strong>Track Task Status:</strong> Mark tasks as completed to monitor your progress.</li>
          <li><strong>Simple and User-Friendly Interface:</strong> Designed for ease of use and quick task management.</li>
        </ul>

        <h2>Built With:</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <img src={reactLogo} alt="React" />
            <span>React</span>
          </div>
          <div className="tech-item">
            <img src={fastapiLogo} alt="FastAPI" />
            <span>FastAPI</span>
          </div>
          <div className="tech-item">
            <img src={redisLogo} alt="Redis" />
            <span>Redis</span>
          </div>
          <div className="tech-item">
            <img src={dockerLogo} alt="Docker" />
            <span>Docker</span>
          </div>
        </div>

        <div className="developer-info">
          <h2>Developed By:</h2>
          <p>Omer Trabulski</p>
          <p>
            <a href="mailto:omer.tr.mail@gmail.com">omer.tr.mail@gmail.com</a>
          </p>
        </div>

        <footer className="about-footer">
          <p>Copyright © 2025, Omer Trabulski. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default About; 