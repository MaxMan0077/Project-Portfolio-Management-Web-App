import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaTasks, FaTrello, FaAddressBook } from 'react-icons/fa';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 relative rounded-b-3xl shadow-lg">
      <div className="max-w-full mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center justify-start">
          <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
        </div>
        <div className="hidden sm:flex justify-center flex-1 items-center">
          {/* Adjusted Links for Team, Projects, Calendar, and Contacts */}
          {[{icon: <FaUsers className="text-3xl text-white"/>, to: "/user-overview", label: "Users"},
            {icon: <FaTasks className="text-3xl text-white"/>, to: "/projects-overview", label: "Projects"},
            {icon: <FaHome className="text-5xl text-white"/>, to: "/dashboard", label: "Dashboard", special: true},
            {icon: <FaTrello className="text-3xl text-white"/>, to: "/kanban", label: "Kanban"},
            {icon: <FaAddressBook className="text-3xl text-white"/>, to: "/contacts", label: "Contacts"}]
            .map((item, index) => (
              <div key={index} className={`px-10 py-2 relative flex flex-col items-center group ${item.special ? 'mx-10' : ''}`}>
                <Link to={item.to} className={`text-center ${item.special ? 'bg-blue-800 rounded-full p-1 transition duration-300 ease-in-out hover:bg-orange-500 flex justify-center items-center' : ''}`} style={item.special ? { width: '80px', height: '80px' } : {}}>
                  {item.icon}
                  <span className="absolute left-1/2 transform -translate-x-1/2 w-auto px-2 py-1 bg-black text-white text-xs rounded-md bottom-0 translate-y-5 opacity-0 group-hover:translate-y-10 group-hover:opacity-100 transition-all duration-300 ease-in-out z-50">{item.label}</span>
                </Link>
              </div>
            ))
          }
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            aria-haspopup="true"
          >
            <span className="sr-only">Open user menu</span>
            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          </button>
          {isProfileMenuOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
              <Link to="/signout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
