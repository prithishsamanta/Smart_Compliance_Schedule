import { Link } from "react-router-dom";
import "../styles/Taskbar.css";

function Taskbar() {
  return (
    <div className="taskbar-container">
      <nav className="taskbar">
        <Link className="taskbar-link" to="/">Home</Link>| {" "}
        <Link className="taskbar-link" to="/viewTask">View Tasks</Link> | {" "}
        <Link className="taskbar-link" to="/addTask">Add Tasks</Link> | {" "}
        <Link className="taskbar-link" to="/viewCalendar">View Calendar</Link>
      </nav>
    </div>
  );
}

export default Taskbar;
