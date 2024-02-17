import React from 'react';
import KanbanColumn from './kanbanComponents/kanbanColumn';

const KanbanBoard = () => {

    const placeholderData = [
        {
          title: 'Qualification',
          cards: [
            {
              id: 1,
              title: '40 Widgets',
              name: 'Leslie Craghead',
              amount: 'US$4,000.00',
              closingDate: '2023-07-28',
              probability: 10,
              expectedRevenue: 400
            },
            {
              id: 2,
              title: '10 Widgets',
              name: 'Leslie Craghead',
              amount: 'US$1,000.00',
              closingDate: '2023-08-11',
              probability: 10,
              expectedRevenue: 100
            },
          ]
        },
        {
          title: 'Needs Analysis',
          cards: [
            {
              id: 3,
              title: '25 Widgets',
              name: 'Leslie Craghead',
              amount: 'US$2,500.00',
              closingDate: '2023-07-11',
              probability: 20,
              expectedRevenue: 500
            },
            {
              id: 4,
              title: '20 Widgets',
              name: 'Leslie Craghead',
              amount: 'US$2,000.00',
              closingDate: '2023-07-27',
              probability: 20,
              expectedRevenue: 400
            },
          ]
        },
        {
          title: 'Value Proposition',
          cards: [
            {
              id: 5,
              title: '80 Widgets',
              name: 'Leslie Craghead',
              amount: 'US$8,000.00',
              closingDate: '2023-08-25',
              probability: 40,
              expectedRevenue: 3200
            },
          ]
        },
        {
          title: 'Identify Decision Makers',
          cards: [
            {
              id: 6,
              title: '100 Widgets',
              name: 'Leslie Craghead',
              amount: 'US$10,000.00',
              closingDate: '2023-07-28',
              probability: 60,
              expectedRevenue: 6000
            },
          ]
        },
        {
          title: 'Proposal/Price Quote',
          cards: [
            {
              id: 7,
              title: '1 Widget',
              name: 'Leslie Craghead',
              amount: 'US$100.00',
              closingDate: '2023-09-09',
              probability: 75,
              expectedRevenue: 75
            },
          ]
        },
      ];
      
      const columns = placeholderData;

  return (
    <div className="flex justify-center min-h-screen pt-4 pb-4">
      <div className="flex space-x-4 overflow-x-auto p-4 bg-gray-300 rounded-lg shadow">
        {columns.map((column, index) => (
          <KanbanColumn key={index} title={column.title} cards={column.cards} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
