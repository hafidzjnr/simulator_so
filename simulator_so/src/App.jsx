import React from 'react';
import Scheduler from '../components/Scheduler';
import { SchedulerProvider } from '../context/SchedulerContext';
import './styles/main.css';

const App = () => {
  return (
    <SchedulerProvider>
      <div className="app-container">
        <h1>Process Scheduler Simulation</h1>
        <Scheduler />
      </div>
    </SchedulerProvider>
  );
};

export default App;