import React, { useEffect, useState } from 'react';
import ProcessList from './ProcessList';
import Timeline from './Timeline';
import ResourceView from './ResourceView';
import Controls from './Controls';
import { useScheduler } from '../hooks/useScheduler';
// import './Scheduler.css';

const Scheduler = () => {
    const {
        processes,
        resources,
        startSimulation,
        pauseSimulation,
        stepSimulation,
        resetSimulation,
        algorithm,
        setAlgorithm,
        log,
    } = useScheduler();

    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                stepSimulation();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, stepSimulation]);

    const handlePlay = () => {
        setIsRunning(true);
        startSimulation();
    };

    const handlePause = () => {
        setIsRunning(false);
        pauseSimulation();
    };

    const handleReset = () => {
        setIsRunning(false);
        resetSimulation();
    };

    const schedulingAlgorithms = ['FCFS', 'RR', 'PRIORITY'];

    const resourceList = [
        { name: 'Resource A (Printer)', isAvailable: !resources.A, heldBy: resources.A },
        { name: 'Resource B (File)', isAvailable: !resources.B, heldBy: resources.B },
    ];

    const timelineEvents = log.map((entry, idx) => ({ time: `T=${idx}`, description: entry }));

    return (
        <div className="scheduler">
            <h1>Process Scheduler Simulation</h1>
            <Controls
                onPlay={handlePlay}
                onPause={handlePause}
                onStep={stepSimulation}
                onReset={handleReset}
                schedulingAlgorithms={schedulingAlgorithms}
                selectedAlgorithm={algorithm}
                onAlgorithmChange={(alg) => setAlgorithm(alg)}
            />
            <ResourceView resources={resourceList} />
            <ProcessList processes={processes} />
            <Timeline events={timelineEvents} />
        </div>
    );
};

export default Scheduler;