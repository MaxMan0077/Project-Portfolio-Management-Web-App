import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addMonths, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';
import Navbar from './navbar';

const Roadmap = () => {
  const [projects, setProjects] = useState([]);
  const today = new Date();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects/getall');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => format(addMonths(today, i), 'MMM'));

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

    return {
      left: `${offset}%`,
      top: '30%', // Center vertically
      width: `${width}%`,
      backgroundColor: 'blue', // Choose color
      height: '20px', // Set a fixed height for the bars
      position: 'absolute',
      minWidth: '2px', // Ensuring that the bar is visible even if it's very short
    };
  };

  return (
    <>
    <Navbar />
    <div className="w-full overflow-x-auto px-2 pt-2">
        {/* Timeline container with grid layout */}
        <div className="grid grid-cols-[auto_repeat(12,_minmax(6rem,_1fr))]" style={{ minWidth: 'max-content' }}>
        {/* Fixed column for project names */}
        <div className="col-span-1 bg-gray-200 text-center font-bold p-2 sticky left-0 z-10">Projects</div>
        {/* Header for months */}
        {months.map((month, index) => (
            <div key={index} className="text-center font-bold p-2 bg-gray-200 border-l border-gray-300">{month}</div>
        ))}
        {/* Project rows */}
        {projects.map((project, projectIndex) => (
            <React.Fragment key={project.idproject}>
            <div className="bg-gray-100 p-2 border-t border-gray-300 sticky left-0 z-0">{project.name}</div>
            {months.map((_, monthIndex) => (
                <div key={monthIndex} className="border-t border-l border-gray-300 relative" style={{ height: '50px' }}> {/* Adjust height as needed */}
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
