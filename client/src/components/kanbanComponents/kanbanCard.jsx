import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const KanbanCard = ({ id, title, status, businessManager, projectManager, budget, phaseStart, phaseEnd }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  const stripColor = 'bg-blue-500';

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="bg-white rounded-lg shadow-lg mb-4 overflow-hidden">
      <div className={`${stripColor} h-3`} style={{ width: '100%' }}></div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        {/* The rest of your card content */}
      </div>
    </div>
  );
};

export default KanbanCard;
