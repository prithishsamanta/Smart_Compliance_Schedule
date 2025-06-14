
# Smart Compliance Scheduler

A full-stack web application designed to help compliance professionals efficiently schedule, track, and manage regulatory tasks. Built with **React**, **Spring Boot**, and **MySQL**, the application provides intuitive interfaces, secure data handling, and powerful task organization features.

---

## Features

- **Task Management**: Create, view, edit, and delete compliance tasks with details including heading, description, due date, due time, status, priority, and people involved.
- **Table & Calendar Views**: Toggle between a modern table and an interactive calendar to visualize and organize tasks by date, priority, or status.
- **File Attachments**: Upload and associate relevant documents with tasks for easy reference and record-keeping.
- **Multi-User Collaboration**: Assign tasks to multiple stakeholders by adding their email addresses.
- **Responsive UI**: Clean, accessible design with a focus on usability for professionals aged 50+.

*Reminders and AI assistant features are planned for future updates.*

---

## Tech Stack

- **Frontend**: React (with React Router, custom CSS)
- **Backend**: Spring Boot (Java, REST APIs, Hibernate/JPA)
- **Database**: MySQL

---

## Project Blueprint

![Blueprint](Snapshots/project_blueprint.png)

---

## Getting Started

### Prerequisites

- Node.js & npm
- Java JDK 17+
- Maven
- MySQL

### Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smart-compliance-scheduler.git
cd smart-compliance-scheduler
```

#### 2. Backend Setup
```bash
cd backend
mvn spring-boot:run
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
