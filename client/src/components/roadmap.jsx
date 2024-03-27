import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './navbar';

const Roadmap = () => {
  const [projects, setProjects] = useState([]);
  const [timeSeries, setTimeSeries] = useState(12);
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
    "Funnel": '#3b82f6',
    "Review & Evaluation": '#22c55e',
    "Business Case Development": '#eab308',
    "In Implementation": '#ef4444',
    "Closed": '#a855f7',
  };

  const getBarStyles = (project, monthIndex) => {
    const monthStart = startOfMonth(addMonths(today, monthIndex));
    const monthEnd = endOfMonth(monthStart);
    const phaseStart = new Date(project.phase_start);
    const phaseEnd = new Date(project.phase_end);

    if (phaseEnd < monthStart || phaseStart > monthEnd) {
      return {}; // Instead of returning none, we return an empty object for framer-motion to handle
    }

    const phaseStartInMonth = phaseStart < monthStart ? monthStart : phaseStart;
    const phaseEndInMonth = phaseEnd > monthEnd ? monthEnd : phaseEnd;

    let width = differenceInDays(phaseEndInMonth, phaseStartInMonth) + 1;
    width = (width / differenceInDays(monthEnd, monthStart)) * 100;

    let offset = differenceInDays(phaseStartInMonth, monthStart);
    offset = (offset / differenceInDays(monthEnd, monthStart)) * 100;
    const barColor = phaseColors[project.phase] || '#bee3f8';

    return {
      left: `${offset}%`,
      width: `${width}%`,
      backgroundColor: barColor,
    };
  };

  const handleTimeSeriesChange = (event) => {
    setTimeSeries(Number(event.target.value));
  };

  // Animation variants for the grid columns and bars
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { width: '0%', opacity: 0 },
    show: { width: '100%', opacity: 1 }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center my-4">
        <div className="text-xl mr-3">Time Period:</div>
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
      {/* Phase Color Key centered with labels below bars */}
      <div className="flex justify-center items-center mb-4">
        <div className="flex">
          {Object.entries(phaseColors).map(([phase, color]) => (
            <div key={phase} className="flex flex-col items-center mr-4">
              <div style={{ backgroundColor: color, width: '200px', height: '20px' }}></div>
              <span style={{ marginTop: '4px' }}>{phase}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full overflow-x-auto px-2 pt-2">
        <motion.div
          className="grid"
          style={{
            gridTemplateColumns: `200px repeat(${timeSeries}, minmax(0, 1fr))`,
          }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Projects header */}
          <motion.div
            className="text-center font-bold p-2 bg-gray-200 border-r border-gray-300 sticky top-0"
            style={{
              gridColumn: "1",
              gridRow: "1",
            }}
            variants={itemVariants}
          >
            Projects
          </motion.div>
  
          {/* Month headers */}
          {months.map((month, index) => (
            <motion.div
              key={index}
              className="text-center font-bold p-2 bg-gray-200 border-l border-gray-300 sticky top-0"
              style={{
                gridColumn: index + 2,
              }}
              variants={itemVariants}
            >
              {month}
            </motion.div>
          ))}
  
          {/* Project names and bars */}
          {projects.map((project, projectIndex) => (
            <React.Fragment key={project.idproject}>
              <motion.div
                layout
                className="bg-gray-100 p-2 border-t border-gray-300"
                style={{
                  gridColumn: "1",
                  gridRowStart: projectIndex + 2,
                }}
                variants={itemVariants}
              >
                {project.name}
              </motion.div>
  
              {Array.from({ length: timeSeries }, (_, monthIndex) => (
                <motion.div
                  key={monthIndex}
                  className="border-t border-l border-gray-300 relative"
                  style={{
                    height: '50px',
                    gridColumn: monthIndex + 2,
                    gridRowStart: projectIndex + 2,
                  }}
                  layout
                  variants={itemVariants}
                >
                  <motion.div
                    className="absolute"
                    style={{ ...getBarStyles(project, monthIndex), height: '20px', top: '30%', minWidth: '2px', zIndex: 1 }}
                    initial={{ width: '0%' }}
                    animate={{
                      width: getBarStyles(project, monthIndex).width,
                      backgroundColor: getBarStyles(project, monthIndex).backgroundColor,
                      transition: { duration: 0.5 },
                    }}
                  />
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </>
  );  
};

export default Roadmap;