import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './kanbanCard';

const KanbanColumn = ({ columnId, title, tasks }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div className="flex flex-col bg-gray-100 p-4 rounded-md w-[calc(20%-0.5rem)] h-full overflow-auto mx-1">
          <h2 className="text-lg font-bold mb-4">{title}</h2>
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col flex-grow min-h-[2rem]" // Adjust min-h-[2rem] as needed to provide enough space
          >
            {tasks && tasks.map((task, index) => (
              task && <KanbanCard key={task.idproject} project={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
