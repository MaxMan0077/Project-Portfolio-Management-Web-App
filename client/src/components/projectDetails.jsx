import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${projectId}`)
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the project details:", error);
      });
  }, [projectId]);

  if (!project) {
    return <div className="text-center mt-5">Loading project details...</div>;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-center text-3xl font-bold my-5">{project.name}</h1>
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        <div className="info-item bg-gray-200 p-4 rounded shadow"><strong>Business Owner:</strong> {project.business_owner}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow"><strong>Project Manager:</strong> {project.project_manager}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow"><strong>Phase:</strong> {project.phase}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow"><strong>Budget:</strong> ${project.budget_approved}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow"><strong>Phase Start:</strong> {project.phase_start.split('T')[0]}</div>
        <div className="info-item bg-gray-200 p-4 rounded shadow"><strong>Phase End:</strong> {project.phase_end.split('T')[0]}</div>
      </div>
    </div>
  );
};

export default ProjectDetails;
