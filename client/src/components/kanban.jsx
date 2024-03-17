import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from './kanbanComponents/kanbanColumn';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects/getall');
        const fetchedProjects = response.data;
        console.log(fetchedProjects);
        const initialColumns = {
          planning: [],
          design: [],
          development: [],
          testing: [],
          deployment: [],
        };
    
        // This assumes your projects have a 'phase' property to sort them into columns
        fetchedProjects.forEach(project => {
          if (initialColumns[project.phase]) {
            initialColumns[project.phase].push(project);
          } else {
            // Handle the case where the project phase doesn't match any column
            console.error(`Project phase '${project.phase}' does not match any column`);
          }
        });
    
        setColumns(initialColumns);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };    
    fetchProjects();
  }, []);
  

  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    // Do nothing if dropped outside a droppable area or in the same place
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    // Create a copy of the current state to manipulate
    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];
    const movedItem = startColumn[source.index];

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newColumn = Array.from(startColumn);
      newColumn.splice(source.index, 1); // Remove the item from its original position
      newColumn.splice(destination.index, 0, movedItem); // Insert the item at its new position
      setColumns({
        ...columns,
        [source.droppableId]: newColumn,
      });
    } else {
      // Moving from one column to another
      const startColumnCopy = Array.from(startColumn);
      const finishColumnCopy = Array.from(finishColumn);
      startColumnCopy.splice(source.index, 1); // Remove the item from the source column
      finishColumnCopy.splice(destination.index, 0, movedItem); // Insert the item into the destination column

      setColumns({
        ...columns,
        [source.droppableId]: startColumnCopy,
        [destination.droppableId]: finishColumnCopy,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center w-full h-screen">
        <div className="flex w-full">
          {Object.keys(columns).map((columnId) => (
            <KanbanColumn
              key={columnId}
              columnId={columnId}
              title={columnId}
              tasks={columns[columnId]}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
