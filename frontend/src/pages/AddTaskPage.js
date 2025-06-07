import React from "react";
import "../styles/AddTaskPage.css";
import { Card, CardContent, Typography } from '@mui/material';
import { useState } from "react";
import { TaskService } from "../services/TaskService";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
const PRIORITY_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 1);

function AddTaskPage() {
  const navigate = useNavigate();
  // State for each field in the form
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [priority, setPriority] = useState(1);
  const [file, setFile] = useState(null);
  const [people, setPeople] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const peopleList = people.split(",").map(email => email.trim()).filter(Boolean);
      
      const taskData = {
        heading,
        description,
        dueDate,
        dueTime,
        status,
        priority,
        people: peopleList
      };

      const savedTask = await TaskService.createTask(taskData, file);
      console.log('Task created:', savedTask);
      
      // Reset form
      setHeading("");
      setDescription("");
      setDueDate("");
      setDueTime("12:00");
      setFile(null);
      setPeople("");
      setStatus(STATUS_OPTIONS[0]);
      setPriority(1);

      // Navigate to task list or show success message
      navigate('/viewTask');
    } catch (err) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-task-page">
      <h2 className="task-list-heading">Add New Tasks</h2>
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
            min={today}
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
          Attach File:
          <input
            type="file"
            accept=".txt,.doc,.docx,.jpeg,.jpg,.png,.pdf"
            onChange={e => setFile(e.target.files[0])}
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
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

export default AddTaskPage;