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

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth(); // 0-indexed month
  const currentDay = currentDate.getDate();

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

  const getCurrentDatePosition = () => {
    if (selectedYear === currentYear) {
      const daysInCurrentMonth = getDaysInMonth(currentDate);
      const currentDayOffset = currentDay / daysInCurrentMonth * 100;
      return currentMonthIndex + currentDayOffset / 100; // This will give us the fractional month index
    }
    return -1; // If not in the current year, return -1
  };

  const currentDatePosition = getCurrentDatePosition(); // Get the current date position for the red line

  const isPhaseInYear = (start, end) => {
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear + 1, 0, 0);
    const phaseStart = parseISO(start);
    const phaseEnd = parseISO(end);
    return (phaseStart >= yearStart && phaseStart <= yearEnd) || (phaseEnd >= yearStart && phaseEnd <= yearEnd);
  };

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
  
        {/* Key for phase colors */}
        <div className="flex justify-around mb-3 mt-6 px-20">
          {Object.entries(phaseColors).map(([phase, color]) => (
            <div key={phase} className="flex flex-col items-center"> {/* Adjusted margin here */}
              <div className="text-sm font-bold">{phase}</div>
              <div style={{ width: '250px', height: '20px', backgroundColor: color }}></div>
            </div>
          ))}
        </div>
  
        {/* Grid structure */}
        <div
          className="grid grid-cols-13 border border-gray-300 relative" // Added relative for positioning the current date line
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
          <div className="bg-gray-500 text-white text-left font-bold p-2 border-r border-gray-300">
            Projects
          </div>
  
          {/* Month headers with grey background */}
          {months.map((month, index) => (
            <div key={index} className="bg-gray-300 text-center font-bold p-2 border-r border-gray-400">
              {month}
            </div>
          ))}
  
          {/* Vertical line for current date */}
          {selectedYear === new Date().getFullYear() && (
            <div
              style={{
                position: 'absolute',
                top: 80,
                bottom: 0,
                left: `calc(200px + (100% - 200px) * ${currentDate.getMonth() / 12 + (currentDate.getDate() - 1) / getDaysInMonth(currentDate) / 12})`, // Calculate left position based on the current date
                width: '3px',
                backgroundColor: '#C20101',
                zIndex: 10,
              }}
            ></div>
          )}
  
          {/* Project names and project bars */}
          {projects
            .filter(project => isPhaseInYear(project.phase_start, project.phase_end)) // Filter projects to include only those within the selected year
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort projects alphabetically by name
            .map((project, projIndex) => (
              <React.Fragment key={project.id}>
                {/* Project name cell */}
                <div className="bg-gray-300 text-left font-bold p-2 border-r border-gray-400" style={{ height: 'auto', minHeight: '50px' }}>
                  {project.name}
                </div>
                
                {/* Timeline cells for each project */}
                {Array.from({ length: 12 }, (_, monthIndex) => {
                  const barPosition = calculateBarPosition(project.phase_start, project.phase_end, monthIndex);
                  const phaseColor = phaseColors[project.phase] || '#dddddd'; // Default color if phase is not found
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
