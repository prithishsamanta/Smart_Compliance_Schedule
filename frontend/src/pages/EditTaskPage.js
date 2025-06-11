import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddTaskPage.css";
import { TaskService } from "../services/TaskService";

const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
const PRIORITY_OPTIONS = Array.from({ length: 9 }, (_, i) => i + 1);

function EditTaskPage() {
  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    fetchTask();
  }, [id]);

  async function fetchTask() {
    try {
      const fetchedTask = await TaskService.getTaskById(id);
      if (fetchedTask) {
        setTask(fetchedTask);
        setHeading(fetchedTask.heading);
        setDescription(fetchedTask.description);
        setDueDate(fetchedTask.dueDate);
        setDueTime(fetchedTask.dueTime);
        setStatus(fetchedTask.status);
        setPriority(fetchedTask.priority);
        setPeople(fetchedTask.people ? fetchedTask.people.join(", ") : "");
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch task');
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
      
      const taskData = {
        id: task.id,
        heading,
        description,
        dueDate,
        dueTime,
        status,
        priority,
        people: peopleList,
        fileName: task.fileName,
        fileType: task.fileType
      };

      const updatedTask = await TaskService.updateTask(id, taskData);
      console.log('Task updated:', updatedTask);
      
      // Navigate back to task list
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

        <button type="submit" disabled={loading}>
          {loading ? 'Updating Task...' : 'Update Task'}
        </button>
      </form>
    </div>
  );
}

export default EditTaskPage; 