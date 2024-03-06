import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';

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
    // Fetch project details
    fetchProjectDetails();
    // Fetch status reports for the project
    fetchStatusReports();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error("There was an error fetching the project details:", error);
    }
  };

  const fetchStatusReports = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/status-reports/${projectId}`);
      setStatusReports(response.data);
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
  
  const handleEditProject = () => {
    // Placeholder for project edit logic
    console.log('Editing project');
    setIsEditModalOpen(false); // Close modal after edit
  };

  const handleDeleteProject = () => {
    // Placeholder for project delete logic
    console.log('Deleting project');
    navigate('/projects-overview'); // Navigate away after deletion
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
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {new Date(report.date).toLocaleDateString()}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-center">
                  <RagStatusCircle status={report.time_rag} />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-center">
                  <RagStatusCircle status={report.scope_rag} />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-center">
                  <RagStatusCircle status={report.cost_rag} />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {report.percentage}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
                  {report.revised_start ? new Date(report.revised_start).toLocaleDateString() : ''}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">
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
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      Edit Project
                    </h3>
                    <div className="mt-2">
                      {/* Edit form fields */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleEditProject} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Save
                </button>
                <button onClick={handleCloseEditModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
                <button onClick={handleDeleteProject} className="mt-3 w-full inline-flex justify-center rounded-md border border-red-600 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm">
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectDetails;
