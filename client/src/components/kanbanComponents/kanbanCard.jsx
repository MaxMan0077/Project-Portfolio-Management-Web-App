import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const KanbanCard = ({ project, index }) => {
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
          <p>{project.description}</p>
          {/* Display other project details as needed */}
        </div>
      )}
    </Draggable>
  );
};


export default KanbanCard;
