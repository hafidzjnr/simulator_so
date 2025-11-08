import React, { createContext, useState } from 'react';

export const SchedulerContext = createContext();

export const SchedulerProvider = ({ children }) => {
    const [processes, setProcesses] = useState([]);
    const [readyQueue, setReadyQueue] = useState([]);
    const [blockedQueue, setBlockedQueue] = useState([]);
    const [resources, setResources] = useState({});
    const [currentProcess, setCurrentProcess] = useState(null);

    const addProcess = (process) => {
        setProcesses((prev) => [...prev, process]);
    };

    const moveToReadyQueue = (process) => {
        setReadyQueue((prev) => [...prev, process]);
    };

    const moveToBlockedQueue = (process) => {
        setBlockedQueue((prev) => [...prev, process]);
    };

    const releaseResource = (resource) => {
        setResources((prev) => ({ ...prev, [resource]: true }));
    };

    const acquireResource = (resource) => {
        setResources((prev) => ({ ...prev, [resource]: false }));
    };

    return (
        <SchedulerContext.Provider
            value={{
                processes,
                readyQueue,
                blockedQueue,
                resources,
                currentProcess,
                addProcess,
                moveToReadyQueue,
                moveToBlockedQueue,
                releaseResource,
                acquireResource,
                setCurrentProcess,
            }}
        >
            {children}
        </SchedulerContext.Provider>
    );
};