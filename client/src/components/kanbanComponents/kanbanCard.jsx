import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import axios from 'axios';

const KanbanCard = ({ project, index }) => {
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      if (project.project_manager) {
        try {
          // Directly use the URL from the response if the route serves the image
          const imageUrl = `http://localhost:5001/api/resources/photo/${project.project_manager}`;
          setPhotoUrl(imageUrl); // Use the constructed URL directly
        } catch (error) {
          console.error('Failed to fetch manager photo:', error.response ? error.response.data : error);
          setPhotoUrl('https://via.placeholder.com/150'); // Fallback URL
        }        
      }
    };

    fetchPhoto();
  }, [project.project_manager]); // Dependency array ensures effect runs when project.project_manager changes

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'NULL') return t('not_applicable');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatBudget = (budget) => {
    return budget ? `$${Number(budget).toFixed(2)}` : t('not_applicable');
  };

  return (
    <Draggable draggableId={String(project.idproject)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white p-4 rounded-lg shadow mb-4 relative"
        >
          {/* Photo of the Project Manager */}
          <img
            src={photoUrl}
            alt="Project Manager"
            className="w-20 h-20 rounded-full border-2 border-white shadow absolute right-2 top-2"
          />

          <h3 className="font-bold text-xl mb-2">{project.name}</h3>
          <p><strong>{t('status')}:</strong> {t(`project_status_${project.status.toLowerCase()}`)}</p>
          <p><strong>{t('business_owner')}:</strong> {project.project_manager}</p>
          <p><strong>{t('budget_approved')}:</strong> {formatBudget(project.budget_approved)}</p>
          <p><strong>{t('phase_start_date')}:</strong> {formatDate(project.phase_start)}</p>
          <p><strong>{t('phase_end_date')}:</strong> {formatDate(project.phase_end)}</p>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
