import React from 'react'; 
import ProcessList from './ProcessList';
import Timeline from './Timeline';
import ResourceView from './ResourceView';
import AddProcessForm from './AddProcessForm';
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
        addProcess,
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
    <div className="scheduler-wrapper">
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

        <div className="scheduler-layout">
            <div className="scheduler-col-1">
                    <AddProcessForm onProcessSubmit={addProcess} />
                <div className="Resource-view panel">
                    <ResourceView resources={resourceList}/>
                </div>
                <div className="process-list panel">
                    <ProcessList processes={processes}/>
                </div>
            </div>

            <div className="scheduler-col-2">
                <div className="timline panel">
                    <Timeline events={timelineEvents}/>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Scheduler;