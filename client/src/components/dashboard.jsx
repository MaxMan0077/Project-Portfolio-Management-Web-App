import React, { useEffect, useState } from "react";
import axios from 'axios';
import Navbar from './navbar';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

export default function Dashboard() {
    const [isFadingIn, setIsFadingIn] = useState(false);
    const [projects, setProjects] = useState([]);
    const [totalExpenditure, setTotalExpenditure] = useState(0);

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
    },[]);

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

    const dataByPhase = generateChartData(projects, 'phase');
    const dataByLocation = generateChartData(projects, 'location');
    const dataByComplexity = generateChartData(projects, 'complexity');

    const renderPieChart = (data, name) => (
        <div className="chart-container bg-white rounded shadow p-4 text-center flex justify-center items-center">
            <PieChart width={200} height={200}>
                <Pie
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    isAnimationActive={true}
                    animationDuration={800}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="dashboard transition-opacity duration-2000 mt-4 p-4 flex items-stretch ${isFadingIn ? 'opacity-100' : 'opacity-0'}">
                {/* Stat Boxes */}
                <div className="stat-box flex-1 bg-white rounded shadow p-4 text-center flex flex-col justify-center mr-2">
                    <div className="stat-title text-gray-500 text-md font-semibold">Total Projects</div>
                    <div className="stat-value text-5xl font-bold">{projects.length}</div>
                </div>
                <div className="stat-box flex-1 bg-white rounded shadow p-4 text-center flex flex-col justify-center mx-2">
                    <div className="stat-title text-gray-500 text-md font-semibold">Total Budget</div>
                    <div className="stat-value text-5xl font-bold">{`$${totalBudget.toLocaleString()}`}</div>
                </div>
                <div className="stat-box flex-1 bg-white rounded shadow p-4 text-center flex flex-col justify-center ml-2">
                    <div className="stat-title text-gray-500 text-md font-semibold">Total Expenditure</div>
                    <div className="stat-value text-5xl font-bold">{`$${totalExpenditure.toLocaleString()}`}</div>
                </div>
    
                {/* Pie Charts */}
                <div className="pie-charts-container flex flex-1 items-stretch justify-center ml-2 gap-2">
                    <div className="pie-chart bg-white rounded shadow p-4 flex justify-center items-center flex-1">
                        {renderPieChart(dataByPhase, 'Phase')}
                    </div>
                    <div className="pie-chart bg-white rounded shadow p-4 flex justify-center items-center flex-1">
                        {renderPieChart(dataByLocation, 'Location')}
                    </div>
                    <div className="pie-chart bg-white rounded shadow p-4 flex justify-center items-center flex-1">
                        {renderPieChart(dataByComplexity, 'Complexity')}
                    </div>
                </div>
            </div>
        </>
    );       
}
