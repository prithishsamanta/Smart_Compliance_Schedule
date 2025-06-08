import React, { useState } from "react";
import "../styles/EventCard.css";
import { TaskService } from "../services/TaskService";

function EventCard({ event, onClose, onStatusChange }) {
  const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
  const [currentStatus, setCurrentStatus] = useState(event.status);
  const [error, setError] = useState("");

  async function handleStatusChange(newStatus) {
    try {
      const updatedTaskData = {
        id: event.id,
        heading: event.title,
        description: event.description,
        dueDate: event.start.toISOString().split('T')[0], 
        dueTime: event.start.toTimeString().split(' ')[0], 
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

  if (!event) return null;

  return (
    <div className="eventcard-modal">
      <div className="eventcard-content">
        <button className="eventcard-close" onClick={onClose}>×</button>
        <h2>{event.title}</h2>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>File:</strong> {event.fileName}</p>
        <p><strong>Status:</strong> {currentStatus}</p>
        <p><strong>Priority:</strong> {event.priority}</p>
        <p><strong>People:</strong> {event.people && event.people.join(", ")}</p>
        <p><strong>Due Date:</strong> {event.start && event.start.toLocaleString()}</p>
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
  );
}

export default EventCard;
