import { Link } from "react-router-dom";
import "./Taskbar.css";

function Taskbar() {
  return (
    <nav className="taskbar">
      <Link to="/">Home</Link>| {" "}
      <Link to="/viewTask">View Tasks</Link> |      {" "}
      {/* <Link to="/add">Add Tasks</Link> | {" "}
      <Link to="/calendar">View Calendar</Link> */}
    </nav>
  );
}

export default Taskbar;
