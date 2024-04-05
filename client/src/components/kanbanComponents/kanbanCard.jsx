import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';

const KanbanCard = ({ project, index }) => {
  const { formatMessage } = useIntl(); // Retrieve formatMessage function for translations
  const t = (id) => formatMessage({ id });

  // Format the start and end dates using toLocaleDateString
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'NULL') return t('not_applicable'); // Translate 'N/A'
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Use 'en-US' for MM/DD/YYYY format
  };

  // Format the budget to display as currency
  const formatBudget = (budget) => {
    return budget ? `$${Number(budget).toFixed(2)}` : t('not_applicable'); // Translate 'N/A' and assumes budget is a number
  };

  return (
    <Draggable draggableId={String(project.idproject)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white p-4 rounded-lg shadow mb-4"
        >
          <h3 className="font-bold text-xl mb-2">{project.name}</h3>
          <p><strong>{t('status')}:</strong> {t(`project_status_${project.status.toLowerCase()}`)}</p> {/* Assuming you have status keys like project_status_active */}
          <p><strong>{t('business_owner')}:</strong> {project.business_owner}</p>
          <p><strong>{t('budget_approved')}:</strong> {formatBudget(project.budget_approved)}</p>
          <p><strong>{t('phase_start_date')}:</strong> {formatDate(project.phase_start)}</p>
          <p><strong>{t('phase_end_date')}:</strong> {formatDate(project.phase_end)}</p>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
