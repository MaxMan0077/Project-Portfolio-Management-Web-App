import React from 'react';

const KanbanCard = ({ title, status, businessManager, projectManager, budget, phaseStart, phaseEnd }) => {
  const stripColor = 'bg-blue-500'; // The color strip at the top of the card

  return (
    <div className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
      {/* Colored strip at the top of the card */}
      <div className={`${stripColor} h-3`} style={{ width: '100%' }}></div>

      <div className="p-4">
        {/* Card content */}
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="mb-1"><strong>Status:</strong> {status}</p>
        <p className="mb-1"><strong>Business Manager:</strong> {businessManager}</p>
        <p className="mb-1"><strong>Project Manager:</strong> {projectManager}</p>
        <p className="mb-1"><strong>Budget:</strong> {budget.toLocaleString()}</p>
        <p className="mb-1"><strong>Phase Start:</strong> {new Date(phaseStart).toLocaleDateString()}</p>
        <p className="mb-1"><strong>Phase End:</strong> {new Date(phaseEnd).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default KanbanCard;
