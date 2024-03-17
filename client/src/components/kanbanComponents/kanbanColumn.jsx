import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './kanbanCard';

const KanbanColumn = ({ columnId, title, tasks }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col bg-gray-100 p-4 rounded-md w-[calc(20%-0.5rem)] h-full overflow-auto mx-1"
        >
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          {tasks && tasks.map((task, index) => (
            task && <KanbanCard key={task.idproject} project={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;