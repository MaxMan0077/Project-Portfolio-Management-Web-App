import React from 'react';

const KanbanCard = ({ title, name, amount, closingDate, probability, expectedRevenue, photoUrl }) => {
  const stripColor = 'bg-blue-500';

  return (
    <div className="bg-white rounded-lg shadow-lg mb-4 relative overflow-hidden">
      {/* Colored strip at the top of the card */}
      <div className={`${stripColor} h-3`} style={{ width: '100%' }}></div>
      
      <div className="p-4">
        <div className="absolute top-0 right-0 mt-2 mr-2 w-16 h-16 bg-white rounded-full overflow-hidden border-2 border-white shadow">
          <img src={photoUrl} alt="Profile" className="w-full h-full object-cover"/>
        </div>
        <h3 className="font-bold text-md">{title}</h3>
        <p>{name}</p>
        <p>Amount: {amount}</p>
        <p>Closing Date: {closingDate}</p>
        <p>Probability: {probability}%</p>
        <p>Expected Revenue: {expectedRevenue}</p>
      </div>
    </div>
  );
};

export default KanbanCard;
