import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addMonths, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import Navbar from './navbar';

const Roadmap = () => {
  const [projects, setProjects] = useState([]);
  const [timeSeries, setTimeSeries] = useState(12); // Default to 12 months
  const today = new Date();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects/getall');
        const sortedProjects = response.data.sort((a, b) => new Date(a.phase_start) - new Date(b.phase_start));
        setProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []); 

  const months = Array.from({ length: timeSeries }, (_, i) => format(addMonths(today, i), 'MMM'));

  const phaseColors = {
    "Funnel": '#3b82f6', // blue-500
    "Review & Evaluation": '#22c55e', // green-500
    "Business Case Development": '#eab308', // yellow-500
    "In Implementation": '#ef4444', // red-500
    "Closed": '#a855f7', // purple-400
  };

  const PhaseColorKey = () => {
    const phases = [
      { name: "Funnel", color: phaseColors["Funnel"] },
      { name: "Review & Evaluation", color: phaseColors["Review & Evaluation"] },
      { name: "Business Case Development", color: phaseColors["Business Case Development"] },
      { name: "In Implementation", color: phaseColors["In Implementation"] },
      { name: "Closed", color: phaseColors["Closed"] },
    ];
  
    return (
      <div className="flex justify-between items-center mb-4">
        {phases.map(phase => (
          <div key={phase.name} className="flex items-center mr-4">
            <span className="inline-block w-32 h-5 mr-2" style={{ backgroundColor: phase.color }}></span>
            <span className="text-sm font-medium">{phase.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const getBarStyles = (project, monthIndex) => {
    const monthStart = startOfMonth(addMonths(today, monthIndex));
    const monthEnd = endOfMonth(monthStart);
    const phaseStart = new Date(project.phase_start);
    const phaseEnd = new Date(project.phase_end);

    if (phaseEnd < monthStart || phaseStart > monthEnd) {
      // Project phase is not within the month
      return { display: 'none' };
    }

    const phaseStartInMonth = phaseStart < monthStart ? monthStart : phaseStart;
    const phaseEndInMonth = phaseEnd > monthEnd ? monthEnd : phaseEnd;

    let width = differenceInDays(phaseEndInMonth, phaseStartInMonth) + 1;
    width = (width / differenceInDays(monthEnd, monthStart)) * 100;

    let offset = differenceInDays(phaseStartInMonth, monthStart);
    offset = (offset / differenceInDays(monthEnd, monthStart)) * 100;
    const barColor = phaseColors[project.phase] || '#bee3f8'; // default color

    return {
      left: `${offset}%`,
      top: '30%',
      width: `${width}%`,
      backgroundColor: barColor,
      height: '20px',
      position: 'absolute',
      minWidth: '2px',
      zIndex: 1,
    };
  };

  const handleTimeSeriesChange = (event) => {
    setTimeSeries(Number(event.target.value));
  };

  const gridTemplateColumns = `auto repeat(${timeSeries}, minmax(0, 1fr))`;

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center my-4">
        <div className="text-xl mr-3">Time Series:</div>
        <select
          id="timeSeries"
          value={timeSeries}
          onChange={handleTimeSeriesChange}
          className="border border-gray-300 rounded px-4 py-2 text-lg"
        >
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
        </select>
      </div>
      <div className="w-full overflow-x-auto px-2 pt-2">
        <PhaseColorKey />
        {/* Adjusted Timeline container with dynamic grid layout */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: gridTemplateColumns,
            minWidth: 'max-content'
          }}
        >
          {/* Fixed column for project names */}
          <div className="col-span-1 bg-gray-200 text-center font-bold p-2 sticky left-0 z-10">Projects</div>
          {/* Dynamic Header for months based on time series */}
          {months.map((month, index) => (
            <div key={index} className={`text-center font-bold p-2 bg-gray-200 border-l border-gray-300 ${index === 0 ? "border-t" : ""}`}>
              {month}
            </div>
          ))}
          {/* Project rows */}
          {projects.map((project, projectIndex) => (
            <React.Fragment key={project.idproject}>
              <div className="bg-gray-100 p-2 border-t border-gray-300 sticky left-0 z-0">
                {project.name}
              </div>
              {Array.from({ length: timeSeries }, (_, monthIndex) => (
                <div key={monthIndex} className="border-t border-l border-gray-300 relative" style={{ height: '50px' }}>
                  <div style={getBarStyles(project, monthIndex)} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default Roadmap;
