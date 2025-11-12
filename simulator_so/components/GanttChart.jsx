import React from "react";
import '../src/styles/GanttChart.css'

const getStateClass = (state) => {
  switch (state) {
    case 'running':
      return 'state-running';
    case 'ready':
      return 'state-ready';
    case 'blocked':
      return 'state-blocked';
    case 'finished':
      return 'state-finished';
    case 'idle':
      return 'state-idle';
    default:
      return 'state-new'; // untuk state'new' atau undefined
  }
};

const GanttChart = ({ ganttData, processes })=> {
  if (!processes || processes.length === 0) {
    return (
      <div className="gant-chart-container panel">
        <h2>GantChart</h2>
        <p>Belum ada proses untuk ditampilkan.</p>
      </div>
    );
  }

  const timePoints = ganttData.map(d => d.t);

  return (
    <div className="gantt-chart-container panel">
      <h2>Gant Chart</h2>
      <div className="gantt-scroll-wrapper">
        <table>
          <thead>
            <tr>
              <th className="process-header-cell">Proses</th>
              {timePoints.map(t => (
              <th key={t} className="time-header-cell">T={t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processes.map(process =>(
              <tr key={process.id}>
                <td className="process-name-cell">{process.id}</td>

                {ganttData.map(dataPoint => {
                  const state = dataPoint.entries[process.id] || 'new';
                  const StateClass = getStateClass(state);

                  return (
                    <td
                      key={`${process.id}-${dataPoint.t}`}
                      className={`gantt-chart-cell ${StateClass}`}
                      title={`proses ${process.id} @ T=${dataPoint.t}: ${state}`}
                    ></td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GanttChart;