import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [statusReports, setStatusReports] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const [editFormData, setEditFormData] = useState({
    businessOwner: '',
    projectManager: '',
    phase: '',
    budget: '',
    phaseStart: '',
    phaseEnd: ''
  });
 

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
        if (response.data) {
          setProject(response.data);
          setEditFormData({
            businessOwner: response.data.business_owner || '',
            projectManager: response.data.project_manager || '',
            phase: response.data.phase || '',
            budget: response.data.budget_approved.toString(), // Convert to string for the input field
            phaseStart: response.data.phase_start.split('T')[0], // Assuming it's in ISO format
            phaseEnd: response.data.phase_end.split('T')[0], // Assuming it's in ISO format
          });
        } else {
          throw new Error('No project data received');
        }
      } catch (error) {
        console.error("There was an error fetching the project details:", error);
        // Optionally set an error state here to inform the user
      }
    };
  
    fetchProjectDetails();
    fetchStatusReports();
  }, [projectId]);
  

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
      setProject(response.data);
      // Populate edit form with the current project details
      setEditFormData({
        businessOwner: response.data.business_owner,
        projectManager: response.data.project_manager,
        phase: response.data.phase,
        budget: response.data.budget_approved.toString(), // Convert to string for the input field
        phaseStart: response.data.phase_start.split('T')[0], // Assuming it's in ISO format
        phaseEnd: response.data.phase_end.split('T')[0], // Assuming it's in ISO format
      });
    } catch (error) {
      console.error("There was an error fetching the project details:", error);
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
  
    if (editFormData.businessOwner && editFormData.businessOwner !== project.business_owner) {
      payload.business_owner = editFormData.businessOwner;
    }
    if (editFormData.projectManager && editFormData.projectManager !== project.project_manager) {
      payload.project_manager = editFormData.projectManager;
    }
    if (editFormData.phase && editFormData.phase !== project.phase) {
      payload.phase = editFormData.phase;
    }
    if (editFormData.budget && editFormData.budget.toString() !== project.budget_approved.toString()) {
      payload.budget_approved = parseFloat(editFormData.budget);
    }
    if (editFormData.phaseStart && editFormData.phaseStart !== project.phase_start.split('T')[0]) {
      const phaseStartDate = new Date(editFormData.phaseStart);
      payload.phase_start = `${phaseStartDate.getFullYear()}-${(phaseStartDate.getMonth() + 1).toString().padStart(2, '0')}-${phaseStartDate.getDate().toString().padStart(2, '0')} 00:00:00`;
    }
    if (editFormData.phaseEnd && editFormData.phaseEnd !== project.phase_end.split('T')[0]) {
      const phaseEndDate = new Date(editFormData.phaseEnd);
      payload.phase_end = `${phaseEndDate.getFullYear()}-${(phaseEndDate.getMonth() + 1).toString().padStart(2, '0')}-${phaseEndDate.getDate().toString().padStart(2, '0')} 00:00:00`;
    }
  
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
      <div className="container mx-auto p-5">
        <div className="mb-4 flex justify-between">
          <button onClick={handleBackClick} className="px-4 py-2 text-white bg-blue-500 rounded">Back</button>
          <button onClick={handleOpenEditModal} className="px-4 py-2 text-white bg-blue-600 rounded">Edit Project</button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold">{project.name}</h1>
        </div>
        <div className="flex justify-between items-center gap-4 mb-10">
          <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Business Owner:</strong> {project.business_owner}</div>
          <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Project Manager:</strong> {project.project_manager}</div>
          <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Phase:</strong> {project.phase}</div>
          <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Budget:</strong> ${project.budget_approved}</div>
          <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Phase Start:</strong> {project.phase_start.split('T')[0]}</div>
          <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Phase End:</strong> {project.phase_end.split('T')[0]}</div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Status Reports</h2> {/* Header for the status reports table */}
          <button onClick={handleCreateStatusReportClick} className="px-4 py-2 font-bold text-white bg-green-500 rounded">+</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Scope</th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Cost</th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Percentage</th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Revised Start</th>
                <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Revised End</th>
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
                  No status reports for this project yet.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {isEditModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            {/* Modal backdrop and alignment container */}
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                {/* Modal content */}
                <form onSubmit={handleEditProjectSubmit} className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Edit Project
                      </h3>
                      {/* Form fields for editing project */}
                      <div className="mt-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwner">Business Owner</label>
                        <input type="text" id="businessOwner" name="businessOwner" value={editFormData.businessOwner} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManager">Project Manager</label>
                        <input type="text" id="projectManager" name="projectManager" value={editFormData.projectManager} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phase">Phase</label>
                        <input type="text" id="phase" name="phase" value={editFormData.phase} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">Budget</label>
                        <input type="number" id="budget" name="budget" value={editFormData.budget} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseStart">Phase Start</label>
                        <input type="date" id="phaseStart" name="phaseStart" value={editFormData.phaseStart} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseEnd">Phase End</label>
                        <input type="date" id="phaseEnd" name="phaseEnd" value={editFormData.phaseEnd} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-between">
                    <div>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mr-3 sm:text-sm">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                        Cancel
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
                        Delete
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
