import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AiTaskChatbot.css";

function AiTaskChatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Describe a task you want to add (e.g., 'Remind me to call John at 5pm tomorrow')." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after 5 seconds or when chat is opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Hide tooltip when chat is opened
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  const sendPrompt = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai/create-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task = await res.json();

      setMessages((msgs) => [
        ...msgs,
        {
          from: "bot",
          text: `Task Created!\nHeading: ${task.heading}\nDescription: ${task.description}\nDue: ${task.dueDate} ${task.dueTime}\nStatus: ${task.status}\nPriority: ${task.priority}\nPeople: ${(task.people || []).join(", ")}\nFile: ${task.file}`
        }
      ]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: "bot", text: "Sorry, I couldn't create the task." }]);
    }

    setInput("");
    setIsLoading(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowTooltip(false); // Hide tooltip when opening chat
    }
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="ai-task-chatbot">
          {/* Header */}
          <div className="ai-task-chatbot-header">
            <div className="ai-task-chatbot-header-content">
              <h3>AI Task Assistant</h3>
              <p>Create tasks with natural language</p>
            </div>
            <button
              onClick={toggleChat}
              className="ai-task-chatbot-close"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="ai-task-chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-task-chatbot-message ${msg.from}`}>
                <div className={`ai-task-chatbot-message-bubble ${msg.from}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-task-chatbot-loading">
                <div className="ai-task-chatbot-loading-bubble">
                  <div className="ai-task-chatbot-loading-dots">
                    <span>●</span>
                    <span>●</span>
                    <span>●</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="ai-task-chatbot-input-container">
            <div className="ai-task-chatbot-input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="ai-task-chatbot-input"
                placeholder="Describe your task..."
                disabled={isLoading}
                onKeyDown={e => { if (e.key === "Enter") sendPrompt(); }}
              />
              <button
                onClick={sendPrompt}
                className="ai-task-chatbot-button"
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip Message */}
      {showTooltip && !isOpen && (
        <div className="ai-task-chatbot-tooltip">
        Chat with AI to add tasks quickly!
        </div>
      )}

      {/* Floating Chat Icon */}
      <div
        onClick={toggleChat}
        className={`ai-task-chatbot-icon ${isOpen ? 'open' : ''}`}
      >
        <span className="ai-task-chatbot-icon-text">
          {isOpen ? "×" : "💬"}
        </span>
      </div>
    </>
  );
}

export default AiTaskChatbot;
