import Taskbar from "../components/Taskbar";
import { useNavigate } from "react-router-dom";
import HomeCard from "../components/HomeCard";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
        <div className="welcome-container">
            <h2>Welcome to the Smart Compliance Scheduler</h2>
            <h4>How would you like to proceed?</h4>
        </div>
        <div className="cards-container">
            <HomeCard />
        </div>
    </div>
  );
}

export default HomePage;