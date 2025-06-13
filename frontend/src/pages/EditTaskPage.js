import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/AddTaskPage.css";
import { TaskService } from "../services/TaskService";

const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
const PRIORITY_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 1);

function EditTaskPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [priority, setPriority] = useState(1);
  const [file, setFile] = useState(null);
  const [people, setPeople] = useState("");

  // today's date in YYYY-MM-DD format
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayFormatted = `${year}-${month}-${day}`;

  useEffect(() => {
    // If we have event data from navigation state, use it
    if (location.state?.event) {
      const event = location.state.event;
      setTask(event);
      setHeading(event.title || event.heading);
      setDescription(event.description);
      setDueDate(event.dueDate);
      
      // Fix time format - remove seconds for HTML input (HH:MM format)
      const timeWithoutSeconds = event.dueTime && event.dueTime.includes(':') 
        ? event.dueTime.split(':').slice(0, 2).join(':')
        : event.dueTime;
      setDueTime(timeWithoutSeconds);
      
      setStatus(event.status);
      setPriority(event.priority);
      setPeople(event.people ? event.people.join(", ") : "");
      setLoading(false);
    } else {
      // Otherwise fetch from the server
      fetchTask();
    }
  }, [id, location.state]);

  async function fetchTask() {
    try {
      const taskData = await TaskService.getTaskById(id);
      setTask(taskData);
      setHeading(taskData.heading);
      setDescription(taskData.description);
      setDueDate(taskData.dueDate);
      
      // Fix time format - remove seconds for HTML input (HH:MM format)
      const timeWithoutSeconds = taskData.dueTime && taskData.dueTime.includes(':') 
        ? taskData.dueTime.split(':').slice(0, 2).join(':')
        : taskData.dueTime;
      setDueTime(timeWithoutSeconds);
      
      setStatus(taskData.status);
      setPriority(taskData.priority);
      setPeople(taskData.people ? taskData.people.join(", ") : "");
    } catch (err) {
      setError('Failed to load task');
      console.error('Error loading task:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const peopleList = people.split(",").map(email => email.trim()).filter(Boolean);
      
      // Fix time format - add seconds if not present
      const formattedTime = dueTime.includes(':') && dueTime.split(':').length === 2 
        ? dueTime + ":00" 
        : dueTime;
      
      const taskData = {
        id: task.id,
        heading,
        description,
        dueDate,
        dueTime: formattedTime,
        status,
        priority,
        people: peopleList
      };
      
      await TaskService.updateTask(id, taskData, file);
      navigate('/viewTask');
    } catch (err) {
      setError(err.message || 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading task...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-task-page">
      <h2 className="task-list-heading">Edit Task</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="add-task-form" onSubmit={handleSubmit}>
        <label className="add-task-form-label">
          Heading:
          <input
            type="text"
            value={heading}
            onChange={e => setHeading(e.target.value)}
            required
          />
        </label>

        <label className="add-task-form-label">
          Description:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="add-task-form-label">
          People Involved (comma-separated emails):
          <input
            type="text"
            placeholder="email1@example.com, email2@example.com"
            value={people}
            onChange={e => setPeople(e.target.value)}
            required
          />
        </label>

        <label className="add-task-form-label">
          Due Date:
          <input
            type="date"
            value={dueDate}
            min={todayFormatted}
            onChange={e => setDueDate(e.target.value)}
            required
          />
        </label>

        <label className="add-task-form-label">
          Due Time:
          <input
            type="time"
            value={dueTime}
            onChange={e => setDueTime(e.target.value)}
            required
          />
        </label>

        <label className="add-task-form-label">
          Status:
          <select value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="add-task-form-label">
          Priority:
          <select value={priority} onChange={e => setPriority(Number(e.target.value))}>
            {PRIORITY_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="add-task-form-label">
          Attach File:
          <input
            type="file"
            accept=".txt,.doc,.docx,.jpeg,.jpg,.png,.pdf"
            onChange={e => setFile(e.target.files[0])}
          />
          {task && task.fileName && !file && (
            <span style={{ marginLeft: '8px', color: '#888', fontSize: '0.9em' }}>
              (Current: {task.fileName})
            </span>
          )}
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating Task...' : 'Update Task'}
        </button>
      </form>
    </div>
  );
}

export default EditTaskPage; 