import React from "react";
import "../styles/EventCard.css"; // (Optional: for custom styles)

function EventCard({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="eventcard-modal">
      <div className="eventcard-content">
        <button className="eventcard-close" onClick={onClose}>×</button>
        <h2>{event.title}</h2>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>File:</strong> {event.file}</p>
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Priority:</strong> {event.priority}</p>
        <p><strong>People:</strong> {event.people && event.people.join(", ")}</p>
        <p><strong>Due Date:</strong> {event.start && event.start.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default EventCard;
