import React from "react";
import Taskbar from "../components/Taskbar";
import "../styles/TaskListPage.css";

function TaskListPage() {

    const tasks = [
    { id: 1, heading: "Submit Report", dueDate: "2024-06-10", status: "In Progress", priority: 2 },
    { id: 2, heading: "Review Audit", dueDate: "2024-06-10", status: "Over Due", priority: 1 },
    { id: 3, heading: "Finish Training", dueDate: "2024-06-10", status: "Completed", priority: 3 },
    { id: 4, heading: "Update Docs", dueDate: "2024-06-10", status: "In Progress", priority: 1 }
  ];

  // Group tasks by status
  const grouped = {
    "In Progress": [],
    "Over Due": [],
    "Completed": []
  };

  // Group tasks by status
  tasks.forEach(task => grouped[task.status].push(task));

  // Sort tasks by priority
  Object.keys(grouped).forEach(status => {
    grouped[status].sort((a, b) => a.priority - b.priority);
  });

  // Render the page
  return (
    <div className="task-list-page">
        <h2 className="task-list-heading">Todays Tasks</h2>
        <div className="tasks-columns">
            {Object.keys(grouped).map(status => (
                <div key={status} className="tasks-column">
                    <h3 className="tasks-column-heading">{status}</h3>
                    <ul className="tasks-list">
                        {grouped[status].map(task => (
                            <li key={task.id}>
                            <strong>{task.heading}</strong> <br />
                            Due: {task.dueDate} <br />
                            Priority: {task.priority}
                          </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
  )
}

export default TaskListPage;