import { Link } from "react-router-dom";
import "../styles/Taskbar.css";

function Taskbar() {
  return (
    <nav className="taskbar">
      <Link to="/">Home</Link>| {" "}
      <Link to="/viewTask">View Tasks</Link> | {" "}
      <Link to="/addTask">Add Tasks</Link> | {" "}
      <Link to="/viewCalendar">View Calendar</Link>
    </nav>
  );
}

export default Taskbar;
