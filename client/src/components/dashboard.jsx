import React, { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from './navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useIntl } from 'react-intl';
import { useLanguage } from '../LanguageContext';

export default function Dashboard() {
    const [isFadingIn, setIsFadingIn] = useState(false);
    const [projects, setProjects] = useState([]);
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const { language } = useLanguage();
    const intl = useIntl();
    const t = (id) => intl.formatMessage({ id });

    // Hardcoded total budget
    const totalBudget = 100000; // Example figure
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        setIsFadingIn(true); // Trigger the fade-in effect

        // Fetch all projects
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/projects/getall');
                setProjects(response.data);

                // Calculate the sum of budget_approved from all projects
                const totalExpenditure = response.data.reduce((acc, project) => acc + project.budget_approved, 0);
                setTotalExpenditure(totalExpenditure);
            } catch (err) {
                console.error('Error fetching projects:', err);
            }
        };

        fetchProjects();
    },[language]);

    // Function to transform data into chart format
    const generateChartData = (projects, key) => {
        const groupBy = projects.reduce((acc, project) => {
        const keyValue = project[key];
        if (!acc[keyValue]) {
            acc[keyValue] = { name: keyValue, value: 0 };
        }
        acc[keyValue].value += 1;
        return acc;
        }, {});
    
        return Object.values(groupBy);
    };

    const getProjectsByPhase = (phase) => {
        return projects.filter(project => project.phase === phase);
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    
    const dataByPhase = generateChartData(projects, 'phase');
    const dataByLocation = generateChartData(projects, 'location');
    const dataByComplexity = generateChartData(projects, 'complexity');

    const renderPieChart = (data, name) => (
        <div className="flex-1 bg-white rounded shadow p-4 text-center flex flex-col justify-center items-center m-2">
            {/* Header in bold */}
            <h3 className="font-bold text-xl mb-4">{name}</h3>
            <PieChart width={400} height={200}>
                <Pie
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50} // This turns the pie chart into a ring
                    fill="#8884d8"
                    isAnimationActive={true}
                    animationDuration={1300}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
        </div>
    );    

    return (
        <>
          <Navbar />
          <div className={`transition-opacity duration-2000 mt-4 p-4 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-wrap justify-around items-stretch">
              {/* Stat Boxes */}
              <div className="flex-1 rounded shadow p-4 m-2 text-center flex flex-col justify-center">
                <div className="text-gray-500 text-md font-semibold">{t('total_projects')}</div>
                <div className="text-3xl font-bold">{projects.length}</div>
              </div>
              <div className="flex-1 rounded shadow p-4 m-2 text-center flex flex-col justify-center">
                <div className="text-gray-500 text-md font-semibold">{t('total_budget')}</div>
                <div className="text-3xl font-bold">{`$${totalBudget.toLocaleString()}`}</div>
              </div>
              <div className="flex-1 rounded shadow p-4 m-2 text-center flex flex-col justify-center">
                <div className="text-gray-500 text-md font-semibold">{t('total_expenditure')}</div>
                <div className="text-3xl font-bold">{`$${totalExpenditure.toLocaleString()}`}</div>
              </div>
              {/* Pie Charts */}
              {renderPieChart(dataByPhase, t('phase'))}
              {renderPieChart(dataByLocation, t('location'))}
              {renderPieChart(dataByComplexity, t('complexity'))}
            </div>
            <div className="mt-8 px-5">
              {/* Header "Active Projects" */}
              <div className="text-left mb-5">
                <h2 className="text-3xl font-bold">{t('active_projects')}</h2>
              </div>
              <div style={{ maxHeight: 'calc(60px * 7)', overflowY: 'auto' }}>
                <table className="min-w-full leading-normal w-full">
                  <thead className="sticky top-0 text-white bg-blue-500">
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('project_name')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('program')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('status')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('location')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('business_owner')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('project_manager')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('budget_approved')}</th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">{t('phase_timeline')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getProjectsByPhase("In Implementation").length > 0 ? (
                      getProjectsByPhase("In Implementation").map((project, index) => (
                        <tr key={index} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200`}>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.name}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.program}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.status}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.location}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.business_owner}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.project_manager}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">{`$${project.budget_approved.toLocaleString()}`}</td>
                          <td className="px-5 py-2 border-b border-gray-200 text-sm">
                            {`${formatDate(project.phase_start)} - ${formatDate(project.phase_end)}`}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center px-5 py-5 border-b border-gray-200 text-lg font-bold">{t('no_projects_in_phase')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      );               
}
