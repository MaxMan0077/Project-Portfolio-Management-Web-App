import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';


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
            const response = await axios.get('http://localhost:5001/api/projects/getall');
            console.log('Projects Data:', response.data);
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

    const handleRowClick = (projectId) => {
        navigate(`/project-details/${projectId}`);
    };    

    const handleCreateProjectClick = () => {
        navigate('/create-project');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await axios.delete(`http://localhost:5001/api/projects/delete/${projectId}`);
            // Filter out the deleted project from the projects state to update the UI.
            setProjects(prevProjects => prevProjects.filter(project => project.idproject !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
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

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };
    
    // An array of phases for demonstration purposes
    const phases = ['Planning', 'Design', 'Development', 'Testing', 'Deployment'];

    return (
        <>
            <Navbar />
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
                    <h2 className="text-xl font-bold mb-3">{phase}</h2>
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
                                    <th className="px-5 py-3 border-b-2 border-gray-200 uppercase tracking-wider">Phase Timeline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getProjectsByPhase(phase).length > 0 ? (
                                    getProjectsByPhase(phase).map((project, index) => (
                                        <tr key={project.idproject} 
                                            className={`group cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200 relative`} 
                                            onClick={() => handleRowClick(project.idproject)}
                                        >
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.name}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.program}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.status}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.location}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.business_owner}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.project_manager}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.budget_approved}</td>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm flex justify-between items-center">
                                                {`${formatDate(project.phase_start)} - ${formatDate(project.phase_end)}`}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out absolute right-0 pr-4">
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.idproject); }} className="text-red-500 hover:text-red-700">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center px-5 py-5 border-b border-gray-200 text-lg font-bold">No projects in this phase</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
            </div>
        </>
    );
};

export default ProjectsOverview;
