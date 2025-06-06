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

  const STATUS_OPTIONS = ["In Progress", "Completed", "Over Due"];
  const [tasksState, setTasksState] = React.useState(tasks);

  function handleStatusChange(taskId, newStatus) {
    setTasksState(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  // Group tasks by status
  const grouped = {
    "In Progress": [],
    "Over Due": [],
    "Completed": []
  };

  // Group tasks by status using tasksState
  tasksState.forEach(task => grouped[task.status].push(task));

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
                            Priority: {task.priority} <br />
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
  )
}

export default TaskListPage;