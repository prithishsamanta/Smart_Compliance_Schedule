import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import AddTask from './pages/AddTaskPage';
import ViewTask from './pages/TaskListPage';
// import ViewCalendar from './pages/CalendarPage';
import Taskbar from './components/Taskbar';
// import { TaskProvider } from './context/TaskContext';
import './App.css';

function App() {
  return (
    <>
      <Taskbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/addTask" element={<AddTask />} /> */}
          <Route path="/viewTask" element={<ViewTask />} />
          {/* <Route path="/viewCalendar" element={<ViewCalendar />} /> */}
        </Routes>
      </main>
    </>
  );
}

export default App;
