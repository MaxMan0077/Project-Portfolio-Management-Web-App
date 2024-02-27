import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProjectsOverview = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects/getall');
            setProjects(response.data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCreateProjectClick = () => {
        navigate('/create-project');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Assume you have a function to get projects by phase
    const getProjectsByPhase = (phase) => {
        return filteredProjects.filter(project => project.phase === phase);
    };

    // An array of phases for demonstration purposes
    const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment'];

    return (
        <div className="container mx-auto py-8 w-full">
            {/* Render a table for each phase */}
            {phases.map(phase => (
                <div key={phase} className="mb-8 w-full">
                    <h2 className="text-xl font-bold mb-3">{phase} Phase</h2>
                    <table className="min-w-full leading-normal w-full">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Project Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Budget Approved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getProjectsByPhase(phase).map((project, index) => (
                                <tr key={index} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200`}>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.status}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.budget_approved}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ProjectsOverview;
