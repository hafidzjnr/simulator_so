import React from 'react';

const ResourceView = ({ resources }) => {
    return (
        <div className="resource-view">
            <h2>Resource Status</h2>
            <ul>
                {resources.map((resource, index) => (
                    <li key={index}>
                        <strong>{resource.name}:</strong> {resource.isAvailable ? 'Available' : `Held by Process ${resource.heldBy}`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourceView;