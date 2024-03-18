import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaProjectDiagram, FaCalendarAlt, FaAddressBook } from 'react-icons/fa';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 relative rounded-b-3xl">
      <div className="max-w-full mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center justify-start">
          <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
        </div>
        <div className="hidden sm:flex justify-center flex-1 items-center">
          <Link to="/team" className="px-10 py-2" aria-label="Team">
            <span className="text-3xl text-white"><FaUsers /></span>
          </Link>
          <Link to="/projects" className="px-10 py-2" aria-label="Projects">
            <span className="text-3xl text-white"><FaProjectDiagram /></span>
          </Link>
          {/* Increase the margin around the Home icon */}
          <div className="relative mx-12"> {/* Increased from mx-8 to mx-12 */}
             <div className="bg-blue-800 rounded-full absolute transition duration-300 ease-in-out hover:bg-orange-500"
                 style={{ width: '80px', height: '80px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Link to="/dashboard" aria-label="Dashboard" className="block h-full w-full flex justify-center items-center">
                <FaHome className="text-5xl text-white" />
              </Link>
            </div>
          </div>
          <Link to="/calendar" className="px-10 py-2" aria-label="Calendar">
            <span className="text-3xl text-white"><FaCalendarAlt /></span>
          </Link>
          <Link to="/contacts" className="px-10 py-2" aria-label="Contacts">
            <span className="text-3xl text-white"><FaAddressBook /></span>
          </Link>
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
          {/* Profile dropdown */}
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
