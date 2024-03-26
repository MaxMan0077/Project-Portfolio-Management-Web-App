import React from 'react';
import Navbar from './navbar';

// Define color mapping for phases
  const phaseColors = {
    'Planning': 'bg-red-400',
    'Design': 'bg-blue-400',
    'Development': 'bg-green-400',
    'Testing': 'bg-yellow-400',
    'Deployment': 'bg-purple-400',
  };
  
  // Define your projects with start and end dates
  const projects = [
    { name: 'Project A', start: '2023-01-01', end: '2023-06-01', phase: 'Planning' },
    // Add other projects
  ];
  
  // Function to create the time series header
  const createTimeSeries = () => {
    const series = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
  
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      series.push(monthDate.toLocaleString('default', { month: 'short' }));
    }
  
    return series;
  };
  
  // Function to get project duration as grid columns
  const getProjectDuration = (start, end, timeSeries) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const duration = [];
  
    timeSeries.forEach((month, index) => {
      if (index >= startMonth && index <= endMonth) {
        duration.push({ month, filled: true });
      } else {
        duration.push({ month, filled: false });
      }
    });
  
    return duration;
  };
  
  // Roadmap component
  const Roadmap = () => {
    const timeSeries = createTimeSeries();
    
    return (
       <> 
        <Navbar />
        <div>
            <div className="flex">
                {timeSeries.map(month => (
                <div key={month} className="w-1/12 text-center p-1 border">{month}</div>
                ))}
            </div>
            {projects.map(project => (
                <div key={project.name} className="flex items-center">
                <div className="w-1/12 p-1 border">{project.name}</div>
                {getProjectDuration(project.start, project.end, timeSeries).map((column, index) => (
                    <div 
                    key={index} 
                    className={`w-1/12 p-1 border ${column.filled ? phaseColors[project.phase] : 'bg-transparent'}`}
                    />
                ))}
                </div>
            ))}
        </div>
      </>
    );
  };
  
  export default Roadmap;
  
