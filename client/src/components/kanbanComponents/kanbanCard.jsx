import React from 'react';

const KanbanCard = ({ title, name, amount, closingDate, probability, expectedRevenue }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-bold text-md">{title}</h3>
      <p>{name}</p>
      <p>Amount: {amount}</p>
      <p>Closing Date: {closingDate}</p>
      <p>Probability: {probability}%</p>
      <p>Expected Revenue: {expectedRevenue}</p>
    </div>
  );
};

export default KanbanCard;
