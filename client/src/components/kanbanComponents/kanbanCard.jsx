import React, { useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useIntl } from 'react-intl';
import axios from 'axios';

const KanbanCard = ({ project, index }) => {
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });
  const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/50');
  const [businessOwnerName, setBusinessOwnerName] = useState('');

  useEffect(() => {
    const fetchPhotoAndName = async () => {
      if (project.business_owner) {
        try {
          // Fetch the photo
          const photoResponse = await axios.get(`http://localhost:5001/api/resources/photo/${project.business_owner}`);
          const base64Filename = photoResponse.data;
          const decodedFilename = atob(base64Filename);
          setPhotoUrl(`http://localhost:5001/uploads/${decodedFilename}`);

          // Fetch the name
          const nameResponse = await axios.get(`http://localhost:5001/api/resources/resourceNames/${project.business_owner}`);
          setBusinessOwnerName(nameResponse.data.firstName);
        } catch (error) {
          console.error('Failed to fetch manager photo or name:', error.response ? error.response.data : error);
          setPhotoUrl('https://via.placeholder.com/150');
          setBusinessOwnerName('Unknown');
        }
      }
    };

    fetchPhotoAndName();
  }, [project.business_owner]);

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'NULL') return t('not_applicable');
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).replace(/ /g, '-');
  };  

  const formatBudget = (budget) => {
    // Check for zero or equivalent values like "0", "", null, or undefined
    if (Number(budget) === 0) {
      return 'Budget USD: 0';
    }
    return budget ? `Budget USD: ${Math.round(Number(budget)).toLocaleString()}` : t('not_applicable');
  };  
  
  const locationColorMap = {
    'Americas': '#9E0B00',
    'Europe': '#9DB0AC',
    'Asia-Pacific': '#F99B21',
    'Middle-East & Africa': '#C69C02'
  };

  const colorStripStyle = {
    height: '16px',
    backgroundColor: locationColorMap[project.location] || '#DDD', // Fallback color if location is not in the map
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px'
  };

  const statusColor = {
    'Red': 'bg-red-500',
    'Amber': 'bg-yellow-500',
    'Green': 'bg-green-500'
  }[project.status] || 'bg-gray-500'; // Default to gray if status is unavailable or doesn't match

  return (
    <Draggable draggableId={String(project.idproject)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white p-4 rounded-lg shadow mb-4 relative overflow-hidden"
        >
          {/* Color strip */}
          <div style={colorStripStyle}></div>

          {/* Content below the color strip */}
          <div className="mt-7">
            <h3 
              className="font-bold text-base mb-2" 
              style={{
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                maxWidth: 'calc(100% - 5rem)',
                marginRight: '4rem'
              }}
            >
              {project.name}
            </h3>
            <p>{formatBudget(project.budget_approved)}</p>
            <p>{formatDate(project.phase_end)}</p>
          </div>

          {/* Photo of the Project Manager and first name */}
          <div className="absolute top-1 right-0 mr-2 flex items-center">
            <span className="mr-2.5 font-semibold">{businessOwnerName}</span>
            <img
              src={photoUrl}
              alt="Business Owner"
              className="w-16 h-16 rounded-full border-2 border-white shadow"
            />
          </div>

          {/* RAG Status Indicator */}
          <div className="absolute bottom-4 right-6">
            <span className={`block w-7 h-7 rounded-full ${statusColor}`}></span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
