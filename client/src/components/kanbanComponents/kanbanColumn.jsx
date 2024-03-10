import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './kanbanCard';

const KanbanColumn = ({ id, title, cards }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="flex flex-col bg-gray-100 p-1 rounded-sm flex-grow min-w-0" style={{ minWidth: 'calc(100% / 5)' }}>
      <h2 className="text-lg font-bold mb-4 text-center bg-gray-800 text-white p-2 rounded">
        {title}
      </h2>
      {cards.map((card, index) => (
        <KanbanCard key={card.id} id={card.id} index={index} {...card} />
      ))}
    </div>
  );
};

export default KanbanColumn;
