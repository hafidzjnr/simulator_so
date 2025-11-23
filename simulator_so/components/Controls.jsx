import React, { useState } from 'react';
import { AiOutlinePlayCircle, AiOutlinePauseCircle, AiOutlineStepForward, AiOutlineReload } from "react-icons/ai";
import '../src/styles/Controls.css';

const Controls = ({
    onPlay, onPause, onStep, onReset,
    schedulingAlgorithms, selectedAlgorithm, onAlgorithmChange
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
        onPlay();
    };

    const handlePause = () => {
        setIsPlaying(false);
        onPause();
    };

    const handleReset = () => {
        setIsPlaying(false);
        onReset();
    };

    return (
        <div className={`controls ${isPlaying ? 'playing' : ''}`}>
            
            <button 
                onClick={handlePlay}
                className={isPlaying ? 'active' : ''}
            >
                <AiOutlinePlayCircle className="ctrl-icon" />
                Play
            </button>

            <button onClick={handlePause}>
                <AiOutlinePauseCircle className="ctrl-icon" />
                Pause
            </button>

            <button onClick={onStep}>
                <AiOutlineStepForward className="ctrl-icon" />
                Step
            </button>

            <button onClick={handleReset}>
                <AiOutlineReload className="ctrl-icon" />
                Reset
            </button>

            <select
                value={selectedAlgorithm}
                onChange={e => onAlgorithmChange(e.target.value)}
            >
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