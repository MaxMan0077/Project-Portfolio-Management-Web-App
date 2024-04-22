import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Dropdown from './dropdown';
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [allResources, setAllResources] = useState([]);
    // Initialize state for each filter
    const [locationFilter, setLocationFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [projectManagerFilter, setProjectManagerFilter] = useState('');
    const [businessOwnerFilter, setBusinessOwnerFilter] = useState('');
    const [programFilter, setProgramFilter] = useState('');
    const headerColors = ['bg-yellow-400', 'bg-amber-500', 'bg-red-500', 'bg-gray-400', 'bg-gray-950'];
    const locations = ["Americas", "Europe", "Asia-Pacific", "Middle-East & Africa"];
    const statusOptions = ["Red", "Amber", "Green"];
   
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
    
    useEffect(() => {
        const fetchResources = async () => {
          try {
            const response = await axios.get('http://localhost:5001/api/resources/getall');
            setAllResources(response.data);
          } catch (error) {
            console.error("There was an error fetching resources:", error);
          }
        };
      
        fetchResources();
    }, []);

    const handleBackClick = () => {
        navigate('/dashboard');
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

    const handleDeleteProject = (projectId, event) => {
        event.stopPropagation(); // Stop the event from bubbling up to higher-level components
        setSelectedProjectId(projectId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteProject = async () => {
        if (selectedProjectId) {
            try {
                await axios.delete(`http://localhost:5001/api/projects/delete/${selectedProjectId}`);
                setProjects(prevProjects => prevProjects.filter(project => project.idproject !== selectedProjectId));
                setIsDeleteModalOpen(false); // Close the modal on successful deletion
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };    

    const DeleteConfirmationModal = () => {
        if (!isDeleteModalOpen) return null;
    
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg shadow-xl">
                    <h4 className="font-semibold text-lg">{t("confirm_delete")}</h4>
                    <p className="my-4">{t("are_sure")}</p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="mt-3 w-full inline-flex justify-center px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            style={{ textDecoration: 'none' }}
                            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                            {t("cancel")}
                        </button>
                        <button 
                            onClick={confirmDeleteProject}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {t("delete")}
                        </button>
                    </div>
                </div>
            </div>
        );
    };     

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!locationFilter || project.location === locationFilter) &&
        (!statusFilter || project.status === statusFilter) &&
        (!projectManagerFilter || project.project_manager === projectManagerFilter) &&
        (!businessOwnerFilter || project.business_owner === businessOwnerFilter)
    );    
    
    const areFiltersApplied = () => {
        return (
          searchTerm.trim() !== '' ||
          locationFilter !== '' ||
          statusFilter !== '' ||
          projectManagerFilter !== '' ||
          businessOwnerFilter !== ''
        );
    };

    const getProjectsByPhase = (phase) => {
        return filteredProjects.filter(project => project.phase.toLowerCase() === phase.toLowerCase());
    };    

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const formatBudget = (budget) => {
        return budget.toLocaleString(); // This will use the browser's default locale to format the number
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
            <DeleteConfirmationModal />
            <div className="py-8 px-5">
                <div className="flex justify-between items-center mb-4 px-4 lg:px-8">
                <button onClick={handleBackClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
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
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="w-1/5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="locationFilter">
                                    {t("location")}
                                </label>
                                <select
                                    id="locationFilter"
                                    className="border py-3 rounded w-full"  // Increased vertical padding
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    <option value="">{t("select_location")}</option>
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="statusFilter">
                                    {t("status")}
                                </label>
                                <select
                                    id="statusFilter"
                                    className="border py-3 rounded w-full"  // Increased vertical padding
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">{t("select_status")}</option>
                                    {statusOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/5">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    {t("business_owner")}
                                </label>
                                <Dropdown
                                    resources={allResources}
                                    selectedResourceId={businessOwnerFilter}
                                    onSelect={setBusinessOwnerFilter}
                                    isValid={true}
                                />
                            </div>
                            <div className="w-1/5">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    {t("project_manager")}
                                </label>
                                <Dropdown
                                    resources={allResources}
                                    selectedResourceId={projectManagerFilter}
                                    onSelect={setProjectManagerFilter}
                                    isValid={true}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => {
                                    setLocationFilter('');
                                    setStatusFilter('');
                                    setProjectManagerFilter('');
                                    setBusinessOwnerFilter('');
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {t("clear_filters")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Render a table for each phase */}
                {phases.map((phase, phaseIndex) => {
                    const projectsInPhase = getProjectsByPhase(phase);
                    const isFilteringActive = locationFilter || statusFilter || projectManagerFilter || businessOwnerFilter || searchTerm;
                    
                    // Only render the phase section if there are projects or no active filtering
                    if (projectsInPhase.length > 0 || !isFilteringActive) {
                        return (
                        <div key={phase} className="mb-8 w-full">
                            <h2 className="text-xl font-bold mb-3">{t(phase)}</h2>
                            <div className="overflow-y-auto max-h-[calc(6*4.5rem)]">
                            <table className="min-w-full leading-normal w-full table-fixed">
                                <thead className={`sticky top-0 text-white ${headerColors[phaseIndex % headerColors.length]} text-left text-sm`}>
                                    <tr>
                                        <th className="px-5 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '20%', maxWidth: '28%', minWidth: '28% !important' }}>{t('project_name')}</th>
                                        <th className="px-3 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '3%', maxWidth: '3%' }}>{t('status')}</th>
                                        <th className="px-5 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '15%', maxWidth: '15%' }}>{t('business_owner')}</th>
                                        <th className="px-5 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '15%', maxWidth: '15%' }}>{t('project_manager')}</th>
                                        <th className="px-5 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '12%', maxWidth: '12%' }}>{t('phase_timeline')}</th>
                                        <th className="px-4 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '3%', maxWidth: '3%' }}>{t('scope')}</th>
                                        <th className="px-4 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '3%', maxWidth: '3%' }}>{t('time')}</th>
                                        <th className="px-4 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '3%', maxWidth: '3%' }}>{t('cost')}</th>
                                        <th className="px-16 py-1.5 border-b-2 border-gray-200 tracking-wider" style={{ width: '11%', maxWidth: '11%' }}>{t('budget')} USD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {projectsInPhase.map((project, index) => {
                                    const rag = ragStatuses[`rag_${project.idproject}`] || { scope_rag: 'unknown', time_rag: 'unknown', cost_rag: 'unknown' };
                                    return (
                                        <tr key={project.idproject} 
                                            onClick={() => handleRowClick(project.idproject)}
                                            className={`group cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200 relative`}>
                                            <td className="px-5 py-2 border-b border-gray-200 text-sm truncate" style={{ maxWidth: '28%' }}>
                                            <div className="whitespace-nowrap overflow-hidden text-ellipsis" title={project.name}>
                                                {project.name}
                                            </div>
                                            </td>
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
                                            <td className="pl-16 pr-5 py-2 border-b border-gray-200 text-sm flex justify-between items-center" style={{paddingBottom: 'calc(0.5rem + 3px)'}}>
                                            {formatBudget(project.budget_approved)}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.idproject, e); }}
                                                className="delete-btn ml-4 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {projectsInPhase.length === 0 && !isFilteringActive && (
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
                        );
                    }
                    return null;
                    })}
            </div>
        </>
    );
};

export default ProjectsOverview;
