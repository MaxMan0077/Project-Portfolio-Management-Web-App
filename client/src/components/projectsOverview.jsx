import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProjectsOverview = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    // Initialize state for each filter
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [projectManagerFilter, setProjectManagerFilter] = useState('');
    const [businessOwnerFilter, setBusinessOwnerFilter] = useState('');
    const [programFilter, setProgramFilter] = useState('');

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

    // Simplified filteredProjects to only filter by project name
    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProjectsByPhase = (phase) => {
        // Apply additional filters if they are set
        return filteredProjects.filter(project => {
            return project.phase.toLowerCase() === phase.toLowerCase() &&
                (locationFilter ? project.location === locationFilter : true) &&
                (statusFilter ? project.status === statusFilter : true) &&
                (projectManagerFilter ? project.project_manager.includes(projectManagerFilter) : true) &&
                (businessOwnerFilter ? project.business_owner.includes(businessOwnerFilter) : true);
        });
    };
    
    // An array of phases for demonstration purposes
    const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment'];

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handleBackClick} className="py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded">
                    Back
                </button>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search by project name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border p-2 w-96"
                    />
                    <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                        Filters
                    </button>
                </div>
                <button onClick={handleCreateProjectClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                    Create Project
                </button>
            </div>
    
            {isFilterVisible && (
                <div className="bg-white p-4 mb-4 shadow rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="locationFilter">
                                Location
                            </label>
                            <input
                                type="text"
                                id="locationFilter"
                                placeholder="Location"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="programFilter">
                                Program
                            </label>
                            <input
                                type="text"
                                id="programFilter"
                                placeholder="Program"
                                value={programFilter}
                                onChange={(e) => setProgramFilter(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="statusFilter">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                className="border p-2 rounded w-full"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Select Status</option>
                                {/* Add options dynamically if you have them */}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManagerFilter">
                                Project Manager
                            </label>
                            <input
                                type="text"
                                id="projectManagerFilter"
                                placeholder="Project Manager"
                                value={projectManagerFilter}
                                onChange={(e) => setProjectManagerFilter(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwnerFilter">
                                Business Owner
                            </label>
                            <input
                                type="text"
                                id="businessOwnerFilter"
                                placeholder="Business Owner"
                                value={businessOwnerFilter}
                                onChange={(e) => setBusinessOwnerFilter(e.target.value)}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    </div>
                </div>
            )}
    
            {/* Render a table for each phase */}
            {phases.map((phase, phaseIndex) => (
            <div key={phase} className="mb-8 w-full">
                <h2 className="text-xl font-bold mb-3">{phase} Phase</h2>
                <div className="overflow-y-auto max-h-[calc(6*4.5rem)]">
                    <table className="min-w-full leading-normal w-full">
                        <thead className={`text-white ${['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'][phaseIndex % 5]}`}>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Project Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Program</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Location</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Business Owner</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Project Manager</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Budget Approved</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Phase Start</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Phase End</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getProjectsByPhase(phase).length > 0 ? (
                                getProjectsByPhase(phase).map((project, index) => (
                                    <tr key={index} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200`}>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.name}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.program}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.status}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.location}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.business_owner}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.project_manager}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.budget_approved}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.phase_start.split('T')[0]}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{project.phase_end.split('T')[0]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center px-5 py-5 border-b border-gray-200 text-lg font-bold">No projects in this phase</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        ))}
        </div>
    );
};

export default ProjectsOverview;
