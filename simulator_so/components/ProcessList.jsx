import React from 'react';

const ProcessList = ({ processes }) => {
    return (
        <div className="process-list">
            <h2>Process List</h2>
            <ul>
                {processes.map((process) => (
                    <li key={process.id}>
                        <span>Process ID: {process.id}</span>
                        <span>State: {process.state}</span>
                        <span>Priority: {process.priority}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProcessList;