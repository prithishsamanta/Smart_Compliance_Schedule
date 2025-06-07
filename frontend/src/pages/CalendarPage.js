import React, { useState, useEffect } from "react";
import Taskbar from "../components/Taskbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/CalendarPage.css";
import EventCard from "../components/EventCard";
import { TaskService } from "../services/TaskService";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function eventStyleGetter(event) {
  let bgColor = "#3174ad";
  if (event.status === "Completed") bgColor = "#4CAF50";
  if (event.status === "Over Due") bgColor = "#FF6347";
  if (event.status === "In Progress") bgColor = "#FFC107";
  return {
    style: {
      backgroundColor: bgColor,
      borderRadius: "8px",
      opacity: 0.9,
      color: "black",
      border: "0px",
      display: "block",
    }
  };
}

// Custom event component for calendar
function CustomEvent({ event }) {
  return <span>{event.title}</span>;
}

function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const fetchedTasks = await TaskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Convert tasks to events format for the calendar
  const events = tasks.map(task => {
    // Create a valid date string by combining date and time
    const dateStr = task.dueDate ? task.dueDate.toString() : '';
    const timeStr = task.dueTime ? task.dueTime.toString() : '00:00:00';
    
    // Create the date object only if we have a valid date
    let dueDate = null;
    
    if (dateStr) {
      try {
        // Parse the date and time
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        dueDate = new Date(year, month - 1, day, hours, minutes);
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }

    return {
      id: task.id,
      title: task.heading,
      start: dueDate || new Date(), // The due date/time of the task
      end: dueDate || new Date(),   // Same as start since tasks are due at a specific time
      description: task.description,
      fileName: task.fileName,
      fileType: task.fileType,
      status: task.status,
      priority: task.priority,
      people: task.people
    };
  }).filter(event => event.start && event.end); // Filter out any events with invalid dates

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="calendar-page-container">
      <h2 className="calendar-title">Task Calendar View</h2>
      <div className="calendar-card">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          popup={true}
          views={["month", "week", "day"]}
          components={{
            event: CustomEvent
          }}
          onSelectEvent={event => setSelectedEvent(event)}
        />
      </div>
      {selectedEvent && (
        <EventCard 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default CalendarPage;
