import React, { useEffect, useState } from "react";
import Taskbar from "../components/Taskbar";
import "../styles/TaskListPage.css";
import { TaskService } from "../services/TaskService";
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

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

  const handleDownload = async (task) => {
    try {
      if (!task.fileName) {
        setError('No file available to download');
        return;
      }

      const response = await TaskService.downloadFile(task.id);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', task.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to download file');
      console.error('Error downloading file:', err);
    }
  };

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
      // Parse the date string as UTC to avoid timezone issues
      const dateParts = dateStr.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based
      const day = parseInt(dateParts[2], 10);

      const timeParts = timeStr ? timeStr.split(":") : ["00", "00", "00"];
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
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

  const navigate = useNavigate();

  const handleEdit = (taskId) => {
    navigate(`/editTask/${taskId}`);
  };

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
                  <div className="task-card">
                    <div className="task-card-header">
                      <h3>{task.heading}</h3>
                      <div className="task-card-actions">
                        <IconButton
                          className="task-card-edit"
                          onClick={() => handleEdit(task.id)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        {task.fileName && (
                          <IconButton
                            className="task-card-download"
                            onClick={() => handleDownload(task)}
                            size="small"
                          >
                            <DownloadIcon />
                          </IconButton>
                        )}
                      </div>
                    </div>
                    <p className="task-card-description">{task.description}</p>
                    <div className="task-card-details">
                      <p><strong>Due Date:</strong> {formatDateTime(task.dueDate, task.dueTime)}</p>
                      <p><strong>Priority:</strong> {task.priority}</p>
                      {task.people && task.people.length > 0 && (
                        <p><strong>People Involved:</strong> {task.people.join(', ')}</p>
                      )}
                      {task.fileName && (
                        <p><strong>File:</strong> {task.fileName}</p>
                      )}
                    </div>
                    <div className="task-card-status">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
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