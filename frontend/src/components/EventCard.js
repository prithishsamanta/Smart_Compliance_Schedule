import React, { useState } from "react";
import "../styles/EventCard.css";
import { TaskService } from "../services/TaskService";
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

function EventCard({ event, onClose, onStatusChange, onDownload }) {
  const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
  const [currentStatus, setCurrentStatus] = useState(event.status);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleStatusChange(newStatus) {
    try {
      const updatedTaskData = {
        id: event.id,
        heading: event.title,
        description: event.description,
        dueDate: event.start ? event.start.toISOString().split('T')[0] : '',
        dueTime: event.start ? event.start.toTimeString().split(' ')[0] : '',
        status: newStatus,
        priority: event.priority,
        people: event.people || [],
        fileName: event.fileName,
        fileType: event.fileType
      };

      const updatedTask = await TaskService.updateTask(event.id, updatedTaskData);
      setCurrentStatus(newStatus);
      if (onStatusChange) {
        onStatusChange(updatedTask);
      }
    } catch (err) {
      setError(err.message || 'Failed to update task status');
      console.error('Error updating task:', err);
    }
  }

  const handleEdit = () => {
    const formattedEvent = {
      ...event,
      dueDate: event.start ? event.start.toISOString().split('T')[0] : '',
      dueTime: event.start ? event.start.toTimeString().split(' ')[0] : ''
    };
    navigate(`/editTask/${event.id}`, { state: { event: formattedEvent } });
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(event.id);
    }
  };

  if (!event) return null;

  return (
    <div className="eventcard-overlay" onClick={onClose}>
      <div className="eventcard-modal" onClick={e => e.stopPropagation()}>
        <div className="eventcard-header">
          <h3>{event.title}</h3>
          <div className="eventcard-actions">
            <IconButton
              className="eventcard-edit"
              onClick={handleEdit}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              className="eventcard-close"
              onClick={onClose}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div className="eventcard-content">
          <p className="eventcard-description"><strong>{event.description}</strong></p>
          <div className="eventcard-details">
            <p><strong>Due Date:</strong> {event.start && event.start.toLocaleDateString()}</p>
            <p><strong>Due Time:</strong> {event.start && event.start.toLocaleTimeString()}</p>
            <p><strong>Status:</strong> {currentStatus}</p>
            <p><strong>Priority:</strong> {event.priority}</p>
            {event.people && event.people.length > 0 && (
              <p><strong>People Involved:</strong> {event.people.join(', ')}</p>
            )}
            <p className="file-info">
              <strong>File:</strong> {event.fileName}
              {event.fileName && (
                <IconButton 
                  onClick={handleDownload}
                  size="small"
                  className="eventcard-download"
                  title="Download file"
                >
                  <DownloadIcon />
                </IconButton>
              )}
            </p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="status-changer-container">
            <select
              value={currentStatus}
              onChange={e => handleStatusChange(e.target.value)}
              className="status-changer"
            >
              {STATUS_OPTIONS.map(statusOption => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
