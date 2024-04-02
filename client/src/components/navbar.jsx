import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaTasks, FaTrello, FaAddressBook } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleProfileClick = () => {
    setIsProfileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      console.log("User confirmed logout.");
      navigate('/');
    }
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.1 }
    }
  };

  return (
    <nav className="bg-gray-800 relative rounded-b-3xl shadow-lg">
      <div className="max-w-full mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center justify-start">
          <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
        </div>
        <div className="hidden sm:flex justify-center flex-1 items-center">
          {[{ icon: <FaUsers className="text-3xl text-white" />, to: "/user-overview", label: "People" },
            { icon: <FaTasks className="text-3xl text-white" />, to: "/projects-overview", label: "Projects" },
            { icon: <FaHome className="text-5xl text-white" />, to: "/dashboard", label: "Dashboard", special: true },
            { icon: <FaTrello className="text-3xl text-white" />, to: "/kanban", label: "Kanban" },
            { icon: <FaAddressBook className="text-3xl text-white" />, to: "/roadmap", label: "Roadmap" }]
            .map((item, index) => (
              <div key={index} className={`px-10 py-2 relative flex flex-col items-center group ${item.special ? 'mx-10' : ''}`}>
                <Link to={item.to} className={`text-center ${item.special ? 'bg-blue-800 rounded-full p-1 transition duration-300 ease-in-out hover:bg-orange-500 flex justify-center items-center' : ''}`} style={item.special ? { width: '80px', height: '80px' } : {}}>
                  {item.icon}
                  <span className="absolute left-1/2 transform -translate-x-1/2 w-auto px-2 py-1 bg-black text-white text-xs rounded-md bottom-0 translate-y-5 opacity-0 group-hover:translate-y-10 group-hover:opacity-100 transition-all duration-300 ease-in-out z-50">{item.label}</span>
                </Link>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={handleProfileClick}
            className="rounded-full text-gray-400 hover:text-white focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isProfileMenuOpen}
          >
            <span className="sr-only">Open user menu</span>
            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
          </button>
          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {
                    opacity: 0,
                    scale: 0.95,
                    y: -20
                  },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      duration: 0.2,
                      when: "beforeChildren",
                      staggerChildren: 0.1,
                    }
                  }
                }}
                className="origin-top-right absolute right-0 mt-48 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                {['Your Profile', 'Settings', 'Logout'].map((text, index) => (
                  <motion.div
                    key={text}
                    variants={{
                      hidden: { x: -10, opacity: 0 },
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: { duration: 0.1 } // Adjust as needed
                      }
                    }}
                  >
                    {text !== 'Logout' ? (
                      <Link to={`/${text.toLowerCase().replace(' ', '-')}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {text}
                      </Link>
                    ) : (
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {text}
                      </button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );  
};

export default Navbar;
