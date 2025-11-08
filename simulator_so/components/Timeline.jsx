import React from 'react';
import './Timeline.css'; // Assuming you have a CSS file for styling the timeline

const Timeline = ({ events }) => {
    return (
        <div className="timeline">
            <h2>Process Scheduling Timeline</h2>
            <div className="timeline-container">
                {events.map((event, index) => (
                    <div key={index} className="timeline-event">
                        <span className="event-time">{event.time}</span>
                        <span className="event-description">{event.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;