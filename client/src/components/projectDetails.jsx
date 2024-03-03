import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [statusReports, setStatusReports] = useState([]);

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
      const response = await axios.get(`http://localhost:5000/api/reports/${projectId}`);
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

  const handleCreateStatusReportClick = () => {
    navigate(`/project/${projectId}/create-status-report`);
  };

  return (
    <div className="container mx-auto p-5">
      <div className="mb-4">
        <button onClick={handleBackClick} className="px-4 py-2 text-white bg-blue-500 rounded">Back</button>
        <button onClick={handleCreateStatusReportClick} className="px-4 py-2 text-white bg-green-500 rounded">Create Status Report</button>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>
      <div className="flex justify-between items-center gap-4 mb-10">
        <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Business Owner:</strong> {project.business_owner}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Project Manager:</strong> {project.project_manager}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Phase:</strong> {project.phase}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Budget:</strong> ${project.budget_approved}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Phase Start:</strong> {project.phase_start.split('T')[0]}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow flex-grow"><strong>Phase End:</strong> {project.phase_end.split('T')[0]}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Report Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
            <tbody>
            {statusReports.length > 0 ? (
              statusReports.map((report, index) => (
                <tr key={report.id || index} className="hover:bg-gray-200">
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {report.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {report.date}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {report.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    {report.details}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-5 py-5 border-b border-gray-200 text-lg font-bold">
                  No status reports for this project yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProjectDetails;
