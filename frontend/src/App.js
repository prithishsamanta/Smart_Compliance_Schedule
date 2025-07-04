import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddTaskPage from './pages/AddTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import TaskListPage from './pages/TaskListPage';
import CalendarPage from './pages/CalendarPage';
import Taskbar from './components/Taskbar';
import AiTaskChatbot from './components/AiTaskChatbot';
// import { TaskProvider } from './context/TaskContext';
import './App.css';

function App() {
  console.log({ AddTaskPage });

  return (
    <>
      <Taskbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addTask" element={<AddTaskPage />} />
          <Route path="/editTask/:id" element={<EditTaskPage />} />
          <Route path="/viewTask" element={<TaskListPage />} />
          <Route path="/viewCalendar" element={<CalendarPage />} />
        </Routes>
        <AiTaskChatbot/>
      </main>
    </>
  );
}

export default App;
