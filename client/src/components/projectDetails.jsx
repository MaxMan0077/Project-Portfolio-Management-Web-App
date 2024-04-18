import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { useIntl } from 'react-intl';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [statusReports, setStatusReports] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const [projectManagerName, setProjectManagerName] = useState('');
  const [businessOwnerName, setBusinessOwnerName] = useState('');
  const [editFormData, setEditFormData] = useState({
    businessOwner: '',
    projectManager: '',
    phase: '',
    budget: '',
    phaseStart: '',
    phaseEnd: '',
    location: '', // Added for location
    description: '' // Added for description
  });  

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
      if (response.data) {
        setProject(response.data);
        setEditFormData({
          businessOwner: response.data.business_owner || '',
          projectManager: response.data.project_manager || '',
          phase: response.data.phase || '',
          budget: response.data.budget_approved.toString(),
          phaseStart: response.data.phase_start.split('T')[0],
          phaseEnd: response.data.phase_end.split('T')[0],
          location: response.data.location || '',
          description: response.data.description || ''
        });

        // Fetch names for business owner and project manager
        fetchResourceName(response.data.business_owner, setBusinessOwnerName);
        fetchResourceName(response.data.project_manager, setProjectManagerName);
      } else {
        throw new Error('No project data received');
      }
    } catch (error) {
      console.error("There was an error fetching the project details:", error);
    }
  };

  const fetchResourceName = async (resourceId, setName) => {
    try {
      const nameResponse = await axios.get(`http://localhost:5001/api/resources/resourceNames/${resourceId}`);
      setName(`${nameResponse.data.firstName} ${nameResponse.data.lastName}`);
    } catch (error) {
      console.error(`Error fetching name for resource ID ${resourceId}:`, error);
      setName('Unavailable');
    }
  };
  
  const fetchStatusReports = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/reports/status-reports/${projectId}`);
      // Assuming the date is in a format that can be directly used for comparison
      // Sort the reports by date in descending order
      const sortedReports = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setStatusReports(sortedReports);
    } catch (error) {
      console.error("There was an error fetching the status reports:", error);
    }
  };
  
  useEffect(() => {  
    fetchProjectDetails();
    fetchStatusReports();
  }, [projectId]); // Ensure useEffect is only re-run when projectId changes

  if (!project) {
    return <div className="text-center mt-5">Loading project details...</div>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleEditProjectSubmit = async (event) => {
    event.preventDefault();
    
    // Construct the payload with only edited fields
    const payload = {};

    // Simplify the comparison logic: if the value is different from the initial, add it to the payload
    const fieldsToUpdate = [
      { key: 'businessOwner', value: editFormData.businessOwner, initial: project.business_owner },
      { key: 'projectManager', value: editFormData.projectManager, initial: project.project_manager },
      { key: 'phase', value: editFormData.phase, initial: project.phase },
      { key: 'budget_approved', value: parseFloat(editFormData.budget), initial: parseFloat(project.budget_approved) },
      { key: 'location', value: editFormData.location, initial: project.location },
      { key: 'description', value: editFormData.description, initial: project.description }
    ];

    fieldsToUpdate.forEach(field => {
      if (field.value.toString() !== field.initial.toString()) {
        payload[field.key] = field.value;
      }
    });

    // Dates need special handling to format properly
    if (editFormData.phaseStart && editFormData.phaseStart !== project.phase_start.split('T')[0]) {
        const phaseStartDate = new Date(editFormData.phaseStart);
        payload.phase_start = `${phaseStartDate.getFullYear()}-${(phaseStartDate.getMonth() + 1).toString().padStart(2, '0')}-${phaseStartDate.getDate().toString().padStart(2, '0')} 00:00:00`;
    }
    if (editFormData.phaseEnd && editFormData.phaseEnd !== project.phase_end.split('T')[0]) {
        const phaseEndDate = new Date(editFormData.phaseEnd);
        payload.phase_end = `${phaseEndDate.getFullYear()}-${(phaseEndDate.getMonth() + 1).toString().padStart(2, '0')}-${phaseEndDate.getDate().toString().padStart(2, '0')} 00:00:00`;
    }

    console.log("Sending payload to update project:", payload);

    try {
        const response = await axios.put(`http://localhost:5001/api/projects/update/${projectId}`, payload);
        console.log('Project updated successfully:', response.data);
        setIsEditModalOpen(false);
        fetchProjectDetails(); // Refetch the project details to update UI
    } catch (error) {
        console.error("There was an error updating the project details:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
        await axios.delete(`http://localhost:5001/api/projects/delete/${projectId}`);
        console.log('Project deleted successfully');
        navigate('/projects-overview');
    } catch (error) {
        console.error('Error deleting project:', error);
        // Optionally, handle the error by showing an error message to the user
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty if no date is provided
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleCreateStatusReportClick = () => {
    navigate(`/project/${projectId}/create-status-report`);
  };

  const RagStatusCircle = ({ status }) => {
    let bgColor;
    switch (status) {
      case 'Red':
        bgColor = 'bg-red-500';
        break;
      case 'Amber':
        bgColor = 'bg-yellow-500';
        break;
      case 'Green':
        bgColor = 'bg-green-500';
        break;
      default:
        bgColor = 'bg-gray-200';
    }
  
    return (
      <div
        className={`w-4 h-4 rounded-full ${bgColor}`}
        title={status}
      />
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto pt-5">
        <div className="mb-4 flex justify-between">
          <button onClick={handleBackClick} className="px-4 py-2 text-white bg-blue-500 rounded">
            {t('back')}
          </button>
          <button onClick={handleOpenEditModal} className="px-4 py-2 text-white bg-blue-600 rounded">
            {t('edit_project')}
          </button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold">{project.name}</h1>
        </div>
        <div className="flex justify-between items-start gap-4 mb-3 flex-wrap">
          {[
            { label: t('phase'), value: t(project.phase) },
            { label: t('budget_approved'), value: `$${project.budget_approved}` },
            { label: t('location'), value: project.location },
            { label: t('project_manager'), value: projectManagerName },
            { label: t('business_owner'), value: businessOwnerName },
            { label: t('phase_start_date'), value: formatDate(project.phase_start) },
            { label: t('phase_end_date'), value: formatDate(project.phase_end) }
          ].map((item, index) => (
            <div key={index} className="info-item bg-gray-200 p-4 rounded shadow flex-grow">
              <div className="font-bold mb-1">{item.label}:</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
        <div className="bg-gray-200 p-2 rounded shadow mb-10">
          <h3 className="text-lg font-bold mb-2">{t('project_description')}:</h3>
          <p>{project.description}</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t('status_reports')}</h2>
          <button onClick={handleCreateStatusReportClick} className="px-4 py-2 font-bold text-white bg-green-500 rounded">
            {t('add')}
          </button>        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('date')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('scope')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('time')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('cost')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('percentage')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('revised_start')}
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  {t('revised_end')}
                </th>
              </tr>
            </thead>
            <tbody>
            {statusReports.length > 0 ? (
              statusReports.map((report, index) => (
                <tr key={report.code || index} className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-5 py-2 border-b border-gray-200 text-sm">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 text-center">
                    <RagStatusCircle status={report.time_rag} />
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 text-center">
                    <RagStatusCircle status={report.scope_rag} />
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 text-center">
                    <RagStatusCircle status={report.cost_rag} />
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 text-sm">
                    {report.percentage}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 text-sm">
                    {report.revised_start ? new Date(report.revised_start).toLocaleDateString() : ''}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-200 text-sm">
                    {report.revised_end ? new Date(report.revised_end).toLocaleDateString() : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-5 py-5 border-b border-gray-200 text-lg font-bold">
                  {t('no_status_reports')}
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {isEditModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto mt-10">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleEditProjectSubmit} className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {t('edit_project')}
                    </h3>
                    <div className="mt-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwner">
                        {t('business_owner')}
                      </label>
                      <input type="text" id="businessOwner" name="businessOwner" value={editFormData.businessOwner} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManager">
                        {t('project_manager')}
                      </label>
                      <input type="text" id="projectManager" name="projectManager" value={editFormData.projectManager} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                        {t('location')}
                      </label>
                      <select
                        id="location"
                        name="location"
                        value={editFormData.location}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">{t('select_location')}</option>
                        <option value="Americas">{t('Americas')}</option>
                        <option value="Europe">{t('Europe')}</option>
                        <option value="Asia-Pacific">{t('Asia-Pacific')}</option>
                        <option value="Middle-East & Africa">{t('Middle-East & Africa')}</option>
                      </select>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phase">
                        {t('phase')}
                      </label>
                      <select
                        id="phase"
                        name="phase"
                        value={editFormData.phase}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">{t('select_phase')}</option>
                        <option value="Funnel">{t('funnel')}</option>
                        <option value="Review & Evaluation">{t('review_evaluation')}</option>
                        <option value="Business Case Development">{t('business_case_development')}</option>
                        <option value="In Implementation">{t('in_implementation')}</option>
                        <option value="Closed">{t('closed')}</option>
                      </select>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                        {t('budget_approved')}
                      </label>
                      <input type="number" id="budget" name="budget" value={editFormData.budget} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        {t('project_description')}
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={editFormData.description}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                      ></textarea>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseStart">
                        {t('phase_start_date')}
                      </label>
                      <input type="date" id="phaseStart" name="phaseStart" value={editFormData.phaseStart} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseEnd">
                        {t('phase_end_date')}
                      </label>
                      <input type="date" id="phaseEnd" name="phaseEnd" value={editFormData.phaseEnd} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-between">
                  <div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mr-3 sm:text-sm">
                      {t('save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                      {t('cancel')}
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        handleDeleteProject();
                      }}
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}
      </div>
     </> 
  );
};
export default ProjectDetails;
