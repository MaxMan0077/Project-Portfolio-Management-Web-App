import React from 'react';
import KanbanCard from './kanbanCard';

const KanbanColumn = ({ title, cards }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md w-72">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {cards.map((card, index) => (
        <KanbanCard key={index} {...card} />
      ))}
    </div>
  );
};

export default KanbanColumn;
