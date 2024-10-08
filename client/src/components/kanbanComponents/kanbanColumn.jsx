import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './kanbanCard';

const KanbanColumn = ({ columnId, title, tasks }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        // Set maximum height and overflow for scrollability
        <div 
          className="flex flex-col bg-gray-100 rounded-md w-[calc(20%-0.5rem)] max-h-full overflow-hidden mx-1"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h2 className="text-lg font-bold p-4 bg-gray-700 text-white rounded-t-md sticky top-0 z-10">
            {title}
          </h2>
          <div
            // Scrollable container for tasks
            className="flex-1 min-h-[2rem] p-2 overflow-auto"
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
