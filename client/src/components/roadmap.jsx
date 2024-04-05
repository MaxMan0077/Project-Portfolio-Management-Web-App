import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addMonths, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './navbar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useIntl } from 'react-intl';

const Roadmap = () => {
  const [projects, setProjects] = useState([]);
  const [timeSeries, setTimeSeries] = useState(12);
  const today = new Date();
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });

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

  const yearRows = () => {
    let yearRowsArray = [];
    const startYear = today.getFullYear();
    const startMonth = today.getMonth(); // January is 0
  
    // Calculate the number of months in each year displayed
    let monthsInStartYear = 12 - startMonth;
    let monthsInSecondYear = Math.min(12, timeSeries - monthsInStartYear);
    let monthsInThirdYear = Math.max(timeSeries - monthsInStartYear - monthsInSecondYear, 0);
  
    // Push the year div for the first year
    yearRowsArray.push(
      <motion.div
        key="startYear"
        className="text-center font-bold p-2 bg-gray-400 border-r border-gray-300 sticky top-0"
        style={{
          gridColumnStart: 2,
          gridColumnEnd: `span ${monthsInStartYear}`,
        }}
        variants={itemVariants}
      >
        {startYear}
      </motion.div>
    );
  
    // Push the year div for the second year
    if (monthsInSecondYear > 0) {
      yearRowsArray.push(
        <motion.div
          key="secondYear"
          className="text-center font-bold p-2 bg-gray-400 border-r border-gray-300 sticky top-0"
          style={{
            gridColumnStart: monthsInStartYear + 2,
            gridColumnEnd: `span ${monthsInSecondYear}`,
            borderLeft: "2px solid black",
          }}
          variants={itemVariants}
        >
          {startYear + 1}
        </motion.div>
      );
    }
  
    // Push the year div for the third year if there are remaining months
    if (monthsInThirdYear > 0) {
      yearRowsArray.push(
        <motion.div
          key="thirdYear"
          className="text-center font-bold p-2 bg-gray-400 border-r border-gray-300 sticky top-0"
          style={{
            gridColumnStart: monthsInStartYear + monthsInSecondYear + 2,
            gridColumnEnd: `span ${monthsInThirdYear}`,
            borderLeft: "2px solid black",
          }}
          variants={itemVariants}
        >
          {startYear + 2}
        </motion.div>
      );
    }
  
    return yearRowsArray;
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

  const exportPDF = () => {
    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    const filename = `MyProjects Roadmap - ${formattedDate}.pdf`;
  
    const input = document.getElementById('exportContent');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    });
  };

  return (
    <>
      <Navbar />
      <div className="w-full overflow-x-auto px-2 pt-2">
        <div className="flex justify-between items-center my-4">
          <div></div>
          <div className="flex items-center justify-center ml-40">
          <div className="text-xl mr-3">{t('time_period')}:</div>
            <select
              id="timeSeries"
              value={timeSeries}
              onChange={handleTimeSeriesChange}
              className="border border-gray-300 rounded px-4 py-2 text-lg"
            >
              <option value="3">{t('3_months')}</option>
              <option value="6">{t('6_months')}</option>
              <option value="12">{t('12_months')}</option>
              <option value="24">{t('24_months')}</option>
            </select>
          </div>
          <button onClick={exportPDF} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded ml-4">
            {t('export_to_pdf')}
          </button>
        </div>
        <div id="exportContent" className="w-full overflow-x-auto px-2 pt-2">
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
                gridRow: "1 / span 3",
              }}
              variants={itemVariants}
            >
              {t('projects_header')}
            </motion.div>
  
            {/* Year Rows Implementation */}
            {yearRows()}
  
            {/* Month headers */}
            {months.map((month, index) => (
              <motion.div
                key={index}
                className="text-center font-bold p-2 bg-gray-200 border-l border-gray-300 sticky top-0"
                style={{
                  gridColumn: index + 2,
                  gridRow: 3,
                }}
                variants={itemVariants}
              >
                {month}
              </motion.div>
            ))}
  
            {/* Projects and bars */}
            {projects.map((project, projectIndex) => (
              <React.Fragment key={project.idproject}>
                <motion.div
                  layout
                  className="bg-gray-100 p-2 border-t border-gray-300"
                  style={{
                    gridColumn: "1",
                    gridRowStart: projectIndex + 4,
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
                      gridRowStart: projectIndex + 4,
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
      </div>
    </>
  );  
};

export default Roadmap;