import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext } from '@dnd-kit/core';
import KanbanColumn from './kanbanComponents/kanbanColumn';


const KanbanBoard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/projects/getall');
        console.log("Projects fetched:", response.data); // Log the fetched projects
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setIsLoading(false);
      }
    };
    

    fetchProjects();
  }, []);

  const organizeProjectsIntoColumns = () => {
    // Mapping phase names from your backend to the titles used in the UI
    const columnTitles = {
      'Planning': 'Planning',
      'Design': 'Design',
      'Development': 'Development',
      'Testing': 'Testing',
      'Deployment': 'Deployment',
    };
  
    // Initialize columns with the appropriate titles and empty card arrays
    const columns = Object.keys(columnTitles).map(phase => ({
      title: columnTitles[phase],
      cards: [],
      phase
    }));
  
    // Iterate over the projects and place them into the correct columns
    projects.forEach(project => {
      // Find the column that corresponds to the project's phase
      const column = columns.find(c => c.phase.toLowerCase() === project.phase.toLowerCase());
      if (column) {
        // Push the project card into the corresponding column
        column.cards.push({
          id: project.idproject, // Using 'idproject' as the identifier in your project table
          title: project.name, // Project name
          status: project.status, // Project status
          businessManager: `${project.business_owner}`, // Example to show business owner
          projectManager: `${project.project_manager}`, // Example to show project manager
          budget: `$${project.budget_approved}`, // Assuming 'budget_approved' is in dollars
          phaseStart: new Date(project.phase_start).toLocaleDateString(), // Convert to locale date string
          phaseEnd: new Date(project.phase_end).toLocaleDateString(), // Convert to locale date string
        });
      }
    });
  
    // Return the array of columns with their cards filled in
    return columns;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over || active.id === over.id) {
      return;
    }
  
    // Logic to reorder items within your state
    // and potentially update your backend.
  };
  
  if (isLoading) return <div>Loading...</div>;

  const columns = organizeProjectsIntoColumns();

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex justify-center w-full h-screen pt-4 pb-4">
        <div className="flex space-x-1 overflow-x-auto p-1 w-full h-full">
          {columns.map((column, index) => (
            <KanbanColumn key={index} title={column.title} cards={column.cards} />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
