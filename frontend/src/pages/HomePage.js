import Taskbar from "../components/Taskbar";
import { useNavigate } from "react-router-dom";
import HomeCard from "../components/HomeCard";
import AiTaskChatbot from "../components/AiTaskChatbot";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
        <div className="welcome-container">
            <h2>Welcome to the Smart Compliance Scheduler</h2>
            <h4>How would you like to proceed?</h4>
        </div>
        <div>
            <HomeCard />
        </div>
        <AiTaskChatbot/>
    </div>
  );
}

export default HomePage;