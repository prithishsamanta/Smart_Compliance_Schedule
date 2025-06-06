import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './HomeCard.css';

function HomeCard({ task }) {
    return (
        <div className="cards-grid">
            <Link to="/tasks" className="card">
                <i className="fas fa-graduation-cap"></i>
                <h2>View Todays Tasks</h2>
                <p>View all the tasks that were due for today</p>
            </Link>
                
            <Link to="/add" className="card">
                <i className="fas fa-briefcase"></i>
                <h2>Add New Tasks</h2>
                <p>Add new tasks to the list</p>
            </Link>
            
            <Link to="/calendar" className="card">
                <i className="fas fa-star"></i>
                <h2>View Calendar</h2>
                <p>View the calendar to see the tasks</p>
            </Link>
        </div>
    )
}

export default HomeCard;