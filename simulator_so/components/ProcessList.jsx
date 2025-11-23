import React from 'react';
import "../src/styles/ProcessList.css";

const ProcessList = ({ processes }) => {
    return (
        <div className="process-list">
            <h2>Process List</h2>
            <ul>
                {processes.map((process) => (
                    <li key={process.id}>
                        <span><strong>Process ID:</strong> {process.id}</span>
                        <span><strong>State:</strong> {process.state}</span>
                        <span><strong>Priority:</strong> {process.priority}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProcessList;