import React, { useEffect, useState } from "react";
import Taskbar from "../components/Taskbar";
import "../styles/TaskListPage.css";
import { TaskService } from "../services/TaskService";

function TaskListPage() {
  const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const fetchedTasks = await TaskService.getTasksByCurrentDate();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = await TaskService.updateTask(taskId, {
        ...task,
        status: newStatus
      });

      setTasks(prev => prev.map(t => 
        t.id === taskId ? updatedTask : t
      ));
    } catch (err) {
      setError(err.message || 'Failed to update task status');
      console.error('Error updating task:', err);
    }
  }

  // Format date and time for display
  const formatDateTime = (dateStr, timeStr) => {
    try {
      const date = new Date(dateStr);
      const time = timeStr || '00:00:00';
      return `${date.toLocaleDateString()} at ${time}`;
    } catch (error) {
      return `${dateStr} at ${timeStr}`;
    }
  };

  // Group tasks by status
  const grouped = {
    "In Progress": [],
    "Over Due": [],
    "Completed": []
  };

  // Group tasks by status
  tasks.forEach(task => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  });

  // Sort tasks by priority
  Object.keys(grouped).forEach(status => {
    grouped[status].sort((a, b) => a.priority - b.priority);
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="task-list-page">
      <h2 className="task-list-heading">Today's Tasks</h2>
      <div className="tasks-columns">
        {Object.keys(grouped).map(status => (
          <div key={status} className="tasks-column">
            <h3 className="tasks-column-heading">{status}</h3>
            <ul className="tasks-list">
              {grouped[status].map(task => (
                <li key={task.id} className="task-item">
                  <strong>{task.heading}</strong>
                  <p>{task.description}</p>
                  <p>Due: {formatDateTime(task.dueDate, task.dueTime)}</p>
                  <p>Priority: {task.priority}</p>
                  {task.fileName && (
                    <p>File: {task.fileName}</p>
                  )}
                  {task.people && task.people.length > 0 && (
                    <p>People: {task.people.join(", ")}</p>
                  )}
                  <div className="status-changer-container">
                    <select
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                      className="status-changer"
                    >
                      {STATUS_OPTIONS.map(statusOption => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskListPage;