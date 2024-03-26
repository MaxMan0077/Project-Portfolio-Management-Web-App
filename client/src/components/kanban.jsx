import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanColumn from './kanbanComponents/kanbanColumn';
import Navbar from './navbar';

const KanbanBoard = () => {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects/getall');
        const fetchedProjects = response.data;
        console.log(fetchedProjects);
        const initialColumns = {
          "Funnel": [],
          "Review & Evaluation": [],
          "Business Case Development": [],
          "In Implementation": [],
          "Closed": [],
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

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    
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
  
      // Send the update to the backend
      try {
        const response = await axios.put(`http://localhost:5001/api/projects/updatePhase/${draggableId}`, {
          phase: destination.droppableId
        });
  
        // Log the success response from the server
        console.log('Project phase updated successfully:', response.data.message);
        console.log(`Project ${draggableId} moved to ${destination.droppableId} phase.`);
      } catch (error) {
        console.error('Error updating project phase:', error);
        // Optionally, you could revert state here if you wanted to handle the error by resetting the UI
      }
    }
  };  

  return (
    <>
      <Navbar />
      {/* This div wraps the entire Kanban board below the navbar */}
      <div className="flex flex-col h-screen pt-6"> {/* Use flex-col and h-screen to organize the content in a column and take up the full height */}
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Ensure the div below takes up all available space and allows flex children to expand */}
          <div className="flex flex-grow overflow-auto"> {/* Use flex-grow to take up available space */}
            {Object.keys(columns).map((columnId) => (
              <KanbanColumn
                key={columnId}
                columnId={columnId}
                title={columnId}
                tasks={columns[columnId]}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default KanbanBoard;
