import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useIntl } from 'react-intl';


const ProjectsOverview = () => {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const t = (id) => formatMessage({ id });
    const [projects, setProjects] = useState([]);
    const [photos, setPhotos] = useState({});
    const [names, setNames] = useState({});
    const [ragStatuses, setRagStatuses] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    // Initialize state for each filter
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [projectManagerFilter, setProjectManagerFilter] = useState('');
    const [businessOwnerFilter, setBusinessOwnerFilter] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const headerColors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'];
   
    const fetchPhoto = async (resourceId) => {
        try {
          const response = await axios.get(`http://localhost:5001/api/resources/photo/${resourceId}`);
          const base64Filename = response.data;
          const decodedFilename = atob(base64Filename);
          return `http://localhost:5001/uploads/${decodedFilename}`;
        } catch (error) {
          console.error(`Error fetching photo for resource ID ${resourceId}:`, error);
          return 'https://via.placeholder.com/150';
        }
    };
      
    const fetchNames = async (resourceId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/resources/resourceNames/${resourceId}`);
            const { firstName, lastName } = response.data;
            return `${firstName} ${lastName}`;
        } catch (error) {
            console.error(`Error fetching name for resource ID ${resourceId}:`, error);
            return 'Unknown';
        }
    };

    const fetchLatestRAGStatus = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/reports/latestRAGStatus/${projectId}`);
            const { cost_rag, scope_rag, time_rag } = response.data;
            return { cost_rag, scope_rag, time_rag };
        } catch (error) {
            console.error(`Error fetching latest RAG status for project ID ${projectId}:`, error);
            return { scope_rag: 'unknown', time_rag: 'unknown', cost_rag: 'unknown' };
        }
    };

    const fetchProjectsAndDetails = async () => {
        try {
          // First, fetch all projects.
          const projectsResponse = await axios.get('http://localhost:5001/api/projects/getall');
          const fetchedProjects = projectsResponse.data;
      
          // Now, fetch additional details for each project.
          const additionalDetailsPromises = fetchedProjects.flatMap(project => [
            fetchPhoto(project.business_owner).then(photoUrl => ({ ['photo_' + project.business_owner]: photoUrl })),
            fetchPhoto(project.project_manager).then(photoUrl => ({ ['photo_' + project.project_manager]: photoUrl })),
            fetchNames(project.business_owner).then(name => ({ ['name_' + project.business_owner]: name })),
            fetchNames(project.project_manager).then(name => ({ ['name_' + project.project_manager]: name })),
            fetchLatestRAGStatus(project.idproject).then(ragStatus => ({ ['rag_' + project.idproject]: ragStatus }))
          ]);
      
          const combinedResults = await Promise.all(additionalDetailsPromises);
      
          // Process combined results and update relevant states.
          let photosObj = {}, namesObj = {}, ragStatusesObj = {};
          combinedResults.forEach(result => {
            const key = Object.keys(result)[0];
            if (key.startsWith('photo_')) {
              photosObj[key] = result[key];
            } else if (key.startsWith('name_')) {
              namesObj[key] = result[key];
            } else if (key.startsWith('rag_')) {
              ragStatusesObj[key] = result[key];
            }
          });
      
          // Update state with projects and their additional details.
          setProjects(fetchedProjects);
          setPhotos(photosObj);
          setNames(namesObj);
          setRagStatuses(ragStatusesObj);
        } catch (error) {
          console.error('Error fetching projects and additional details:', error);
        }
    };

    useEffect(() => {
        fetchProjectsAndDetails(); // This function will utilize the above-defined functions.
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

    const formatBudget = (budget) => {
        if (budget >= 1000000) {
            return `$${(budget / 1000000).toFixed(1)}M`;
        } else if (budget >= 1000) {
            return `$${(budget / 1000).toFixed(1)}K`;
        } else {
            return `$${budget}`;
        }
    };

    const getRAGColor = (rag) => {
        switch (rag) {
            case 'Red': return 'bg-red-500';
            case 'Amber': return 'bg-yellow-500';
            case 'Green': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    }
    
    // An array of phases for demonstration purposes
    const phases = [
        'Funnel', 
        'Review & Evaluation', 
        'Business Case Development', 
        'In Implementation', 
        'Closed'
    ];

    return (
        <>
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handleBackClick} className="py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded">
                        {t("back")}
                    </button>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={t("search_by_project_name")}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border p-2 w-96"
                        />
                        <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                            {t("filters")}
                        </button>
                    </div>
                    <button onClick={handleCreateProjectClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                        {t("create_project")}
                    </button>
                </div>
        
                {isFilterVisible && (
                    <div className="bg-white p-4 mb-4 shadow rounded">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="locationFilter">
                                    {t("location")}
                                </label>
                                <input
                                    type="text"
                                    id="locationFilter"
                                    placeholder={t("location")}
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="programFilter">
                                    {t("program")}
                                </label>
                                <input
                                    type="text"
                                    id="programFilter"
                                    placeholder={t("program")}
                                    value={programFilter}
                                    onChange={(e) => setProgramFilter(e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="statusFilter">
                                    {t("status")}
                                </label>
                                <select
                                    id="statusFilter"
                                    className="border p-2 rounded w-full"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">{t("select_status")}</option>
                                    {/* Dynamically generated options */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManagerFilter">
                                    {t("project_manager")}
                                </label>
                                <input
                                    type="text"
                                    id="projectManagerFilter"
                                    placeholder={t("project_manager")}
                                    value={projectManagerFilter}
                                    onChange={(e) => setProjectManagerFilter(e.target.value)}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwnerFilter">
                                    {t("business_owner")}
                                </label>
                                <input
                                    type="text"
                                    id="businessOwnerFilter"
                                    placeholder={t("business_owner")}
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
                        <h2 className="text-xl font-bold mb-3">{t(phase)}</h2>
                        <div className="overflow-y-auto max-h-[calc(6*4.5rem)]">
                        <table className="min-w-full leading-normal w-full">
                                <thead className={`sticky top-0 text-white ${headerColors[phaseIndex % headerColors.length]} text-left text-sm`}>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('project_name')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('status')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('business_owner')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('project_manager')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('phase_timeline')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('scope')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('time')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider text-center">{t('cost')}</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 tracking-wider">{t('budget_approved')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getProjectsByPhase(phase).length > 0 ? (
                                        getProjectsByPhase(phase).map((project, index) => {
                                            const rag = ragStatuses[`rag_${project.idproject}`] || { scope_rag: 'unknown', time_rag: 'unknown', cost_rag: 'unknown' };  // Define 'rag' correctly here
                                            return (
                                                <tr key={project.idproject} 
                                                    onClick={() => handleRowClick(project.idproject)}
                                                    className={`group cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200 relative`} 
                                                >
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm">{project.name}</td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                                                        <span className={`inline-block w-4 h-4 rounded-full ${getRAGColor(project.status)}`} />
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                                                        <div className="flex items-center">
                                                            <img src={photos[`photo_${project.business_owner}`] || 'https://via.placeholder.com/150'} alt="Business Owner" className="h-7 w-7 rounded-full" />
                                                            <span className="ml-3">{names[`name_${project.business_owner}`] || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                                                        <div className="flex items-center">
                                                            <img src={photos[`photo_${project.project_manager}`] || 'https://via.placeholder.com/150'} alt="Project Manager" className="h-7 w-7 rounded-full" />
                                                            <span className="ml-3">{names[`name_${project.project_manager}`] || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm">
                                                        {`${formatDate(project.phase_start)} - ${formatDate(project.phase_end)}`}
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                                                        <span className={`inline-block w-4 h-4 rounded-full ${getRAGColor(rag.scope_rag)}`} />
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                                                        <span className={`inline-block w-4 h-4 rounded-full ${getRAGColor(rag.time_rag)}`} />
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm text-center">
                                                        <span className={`inline-block w-4 h-4 rounded-full ${getRAGColor(rag.cost_rag)}`} />
                                                    </td>
                                                    <td className="px-5 py-2 border-b border-gray-200 text-sm flex justify-between items-center" style={{paddingBottom: 'calc(0.5rem + 3px)'}}>
                                                        {formatBudget(project.budget_approved)}
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.idproject); }} 
                                                            className="delete-btn ml-4 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="text-center px-5 py-2 border-b border-gray-200 text-lg font-bold">
                                                {t("no_projects_in_phase")}
                                            </td>
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
