import React from 'react'; 
import ProcessList from './ProcessList';
import Timeline from './Timeline';
import ResourceView from './ResourceView';
import Controls from './Controls';
import { useScheduler } from '../hooks/useScheduler';
import '../src/styles/Scheduler.css';

const Scheduler = () => {
    const {
        processes,
        resources,
        startSimulation, // Ambil fungsi aslinya
        pauseSimulation, // Ambil fungsi aslinya
        stepSimulation,
        resetSimulation, // Ambil fungsi aslinya
        algorithm,
        setAlgorithm,
        log,
    } = useScheduler();

    const schedulingAlgorithms = ['FCFS', 'RR', 'PRIORITY', 'SJF'];

    const resourceList = [
        { name: 'Resource A (Printer)', isAvailable: !resources.A, heldBy: resources.A },
        { name: 'Resource B (File)', isAvailable: !resources.B, heldBy: resources.B },
    ];

    // Perbaikan dari sebelumnya untuk parsing log
    const timelineEvents = log.map((entry) => {
        const parts = entry.split(': ');
        const time = parts[0]; 
        const description = parts.slice(1).join(': ');
        return { time, description };
    });

    return (
        <div className="scheduler">
            <h1>Process Scheduler Simulation</h1>
            <Controls
                onPlay={startSimulation}  // Langsung gunakan fungsi dari hook
                onPause={pauseSimulation} // Langsung gunakan fungsi dari hook
                onStep={stepSimulation}
                onReset={resetSimulation} // Langsung gunakan fungsi dari hook
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