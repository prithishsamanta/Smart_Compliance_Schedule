import React from "react";
import Taskbar from "../components/Taskbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/CalendarPage.css";

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

const tasks = [
  {
    id: 1,
    heading: "Submit Report",
    description: "End of quarter financials",
    file: "financials.pdf",
    dueDate: "2024-06-07T10:00:00",
    status: "In Progress",
    priority: 1,
    peopleList: ["user1@example.com", "user2@example.com"]
  },
  {
    id: 2,
    heading: "Review Audit",
    description: "Annual audit review",
    file: "audit.docx",
    dueDate: "2024-06-08T09:00:00",
    status: "Completed",
    priority: 2,
    peopleList: ["user3@example.com"]
  },
  {
    id: 3,
    heading: "Finish Training",
    description: "Complete compliance training",
    file: "training.pdf",
    dueDate: "2024-06-08T14:00:00",
    status: "Over Due",
    priority: 3,
    peopleList: ["user4@example.com", "user5@example.com"]
  }
];

// Map tasks to events for calendar
const events = tasks.map(task => ({
  id: task.id,
  title: task.heading,
  start: new Date(task.dueDate),
  end: new Date(task.dueDate),
  description: task.description,
  file: task.file,
  status: task.status,
  priority: task.priority,
  people: task.peopleList
}));

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
  return (
    <div>
      <strong>{event.title}</strong><br />
      Description: {event.description}<br />
      File: {event.file}<br />
      Status: {event.status}<br />
      Priority: {event.priority}<br />
      People: {event.people && event.people.join(", ")}
    </div>
  );
}

function CalendarPage() {
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
        />
      </div>
    </div>
  );
}

export default CalendarPage;
