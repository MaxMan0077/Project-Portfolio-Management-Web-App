import React from 'react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
      <button onClick={closeSidebar} className="p-4">Close</button>
      {/* Sidebar content */}
      <div className="p-4">
        <h2>Sidebar Content</h2>
        {/* Add links or other content here */}
      </div>
    </div>
  );
};

export default Sidebar;