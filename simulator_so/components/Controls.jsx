import React from 'react';

const Controls = ({ onPlay, onPause, onStep, onReset, schedulingAlgorithms, selectedAlgorithm, onAlgorithmChange }) => {
    return (
        <div className="controls">
            <button onClick={onPlay}>Play</button>
            <button onClick={onPause}>Pause</button>
            <button onClick={onStep}>Step</button>
            <button onClick={onReset}>Reset</button>
            <select value={selectedAlgorithm} onChange={e => onAlgorithmChange(e.target.value)}>
                {schedulingAlgorithms.map((algorithm, index) => (
                    <option key={index} value={algorithm}>
                        {algorithm}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Controls;