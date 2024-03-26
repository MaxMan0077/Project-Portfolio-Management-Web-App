import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';

const Roadmap = () => {
  const [projects, setProjects] = useState([]);

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

  const months = Array.from({ length: 12 }, (_, i) => new Date(new Date().setMonth(new Date().getMonth() + i)).toLocaleString('default', { month: 'short' }));
  const projectColumnWidth = "20%"; // Fixed width for the project name boxes

  // Helper function to calculate the percentage of the month
  const getPercentageOfMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const totalDaysInMonth = endOfMonth.getDate();
    const dayOfEndPhase = date.getDate();

    return (dayOfEndPhase / totalDaysInMonth) * 100;
  };

  return (
    <>
      <Navbar />
      <div className="w-full pt-2 px-2">
        <div className="flex w-full">
          <div className="text-center font-bold p-2 bg-gray-200" style={{ width: projectColumnWidth }}>Projects</div>
          {months.map((month, index) => (
            <div key={index} className="flex-grow text-center font-bold p-2 border-b border-gray-300" style={{ width: `calc((100% - ${projectColumnWidth}) / ${months.length})` }}>{month}</div>
          ))}
        </div>
        <div className="flex flex-col w-full">
          {projects.map((project) => {
            const startDate = new Date(project.phase_start);
            const endDate = new Date(project.phase_end);
            const startMonthIndex = startDate.getMonth() - new Date().getMonth();
            const endMonthIndex = endDate.getMonth() - new Date().getMonth();

            return (
              <div key={project.idproject} className="flex w-full items-center my-1">
                <div className="bg-gray-100 p-2 border-r border-gray-300" style={{ width: projectColumnWidth }}>{project.name}</div>
                <div className="flex border-b border-gray-300" style={{ width: `calc(100% - ${projectColumnWidth})` }}>
                  {months.map((_, index) => (
                    <div key={index} className={`flex-grow relative ${index >= startMonthIndex && index <= endMonthIndex ? 'bg-blue-300' : 'bg-transparent'}`} style={{ height: '20px', width: `calc((100% - ${projectColumnWidth}) / ${months.length})` }}>
                      {((index === startMonthIndex) || (index === endMonthIndex)) && (
                        <div className="absolute top-0 h-full bg-blue-500" style={{ width: `${getPercentageOfMonth(index === startMonthIndex ? startDate : endDate)}%` }}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Roadmap;
