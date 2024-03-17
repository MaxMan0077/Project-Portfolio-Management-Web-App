import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const KanbanCard = ({ project, index }) => {
  // Format the start and end dates using toLocaleDateString
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'NULL') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Use 'en-US' for MM/DD/YYYY format
  };

  // Format the budget to display as currency
  const formatBudget = (budget) => {
    return budget ? `$${Number(budget).toFixed(2)}` : 'N/A'; // Assumes budget is a number
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
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Business Owner:</strong> {project.business_owner}</p>
          <p><strong>Budget Approved:</strong> {formatBudget(project.budget_approved)}</p>
          <p><strong>Phase Start Date:</strong> {formatDate(project.phase_start)}</p>
          <p><strong>Phase End Date:</strong> {formatDate(project.phase_end)}</p>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
