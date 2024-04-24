import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, differenceInCalendarMonths, getDaysInMonth} from 'date-fns';
import Navbar from './navbar';
import { useIntl } from 'react-intl';

const phaseColors = {
  'Funnel': '#FCDA0D',
  'Review & Evaluation': '#F99B21',
  'Business Case Development': '#FF4B3D',
  'In Implementation': '#9DB0AC',
  'Closed': '#000000',
};

const Roadmap = () => {
  const [projects, setProjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects/getall');
        const sortedProjects = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Function to calculate the start month offset for a project
  const getMonthOffset = (date) => {
    const yearStart = new Date(selectedYear, 0, 1);
    return differenceInCalendarMonths(parseISO(date), yearStart);
  };

  // Function to calculate the width and left offset of the bar
  const calculateBarPosition = (start, end, monthIndex) => {
    const monthStartDate = new Date(selectedYear, monthIndex, 1);
    const monthEndDate = new Date(selectedYear, monthIndex + 1, 0); // Last day of the month
  
    const projectStartDate = parseISO(start);
    const projectEndDate = parseISO(end);
  
    // If the project start date is before the month start date, we'll set the bar to start at the beginning of the cell
    // If the project end date is after the month end date, we'll set the bar to end at the end of the cell
    const startDayFraction = projectStartDate < monthStartDate ? 0 : (projectStartDate.getDate() - 1) / getDaysInMonth(monthStartDate);
    const endDayFraction = projectEndDate > monthEndDate ? 1 : projectEndDate.getDate() / getDaysInMonth(monthEndDate);
  
    const startPosition = startDayFraction * 100;
    const endPosition = endDayFraction * 100;
    const width = endPosition - startPosition;
  
    return { left: `${startPosition}%`, width: `${width}%` };
  };

  // Generate months for the selected year
  const months = Array.from({ length: 12 }, (_, i) => format(new Date(selectedYear, i), 'MMM'));

  // Increment the selected year
  const incrementYear = () => {
    setSelectedYear(prevYear => prevYear + 1);
  };

  // Decrement the selected year
  const decrementYear = () => {
    setSelectedYear(prevYear => prevYear - 1);
  };

  return (
    <>
      <Navbar />
      <div className="w-full overflow-x-auto px-2 pt-2">
        {/* Year selector with arrow buttons */}
        <div className="flex justify-center items-center my-4">
          <button onClick={decrementYear} className="text-2xl font-bold mx-4">
            &#8592; {/* Left arrow symbol */}
          </button>
          <div className="text-2xl font-bold">{selectedYear}</div>
          <button onClick={incrementYear} className="text-2xl font-bold mx-4">
            &#8594; {/* Right arrow symbol */}
          </button>
        </div>
  
        {/* Grid structure */}
        <div
          className="grid grid-cols-13 border border-gray-300"
          style={{ gridTemplateColumns: '200px repeat(12, 1fr)' }}
        >
          {/* Year header */}
          <div
            className="col-span-13 bg-black text-white text-center font-bold p-2"
            style={{ gridColumnEnd: 'span 13' }}
          >
            {selectedYear}
          </div>
  
          {/* Projects header with dark grey background */}
          <div className="bg-gray-500 text-white text-center font-bold p-2 border-r border-gray-300">
            Projects
          </div>
  
          {/* Month headers with grey background */}
          {months.map((month, index) => (
            <div key={index} className="bg-gray-300 text-center font-bold p-2 border-r border-gray-400">
              {month}
            </div>
          ))}
  
          {/* Project names and project bars */}
          {projects.sort((a, b) => a.name.localeCompare(b.name)).map((project, projIndex) => (
            <React.Fragment key={project.id}>
              {/* Project name cell */}
              <div className="bg-gray-300 text-center font-bold p-2 border-r border-gray-400" style={{ height: 'auto', minHeight: '50px' }}>
                {project.name}
              </div>
              
              {/* Timeline cells for each project */}
              {Array.from({ length: 12 }, (_, monthIndex) => {
                const barPosition = calculateBarPosition(project.phase_start, project.phase_end, monthIndex);
                const phaseColor = phaseColors[project.phase] || '#dddddd'; // default color if phase is not found
                return (
                  <div
                    key={monthIndex}
                    className="relative p-2 border-t border-r border-gray-400 bg-white"
                    style={{ height: '100%' }}
                  >
                    {/* Bar for project phase dates */}
                    {monthIndex >= getMonthOffset(project.phase_start) &&
                    monthIndex <= getMonthOffset(project.phase_end) && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: barPosition.left,
                          width: barPosition.width,
                          transform: 'translateY(-50%)', // Center the bar vertically
                          height: '20px', // Fixed height of the bar
                          backgroundColor: phaseColor,
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );  
};

export default Roadmap;
