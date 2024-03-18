import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from './navbar';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isFadingIn, setIsFadingIn] = useState(false);

    useEffect(() => {
        setIsFadingIn(true); // Trigger the fade-in effect
    }, []); // Empty array ensures this effect only runs once on mount

    const handleCreateUserClick = () => {
        navigate('/user-overview');
    };

    const handleCreateProjectClick = () => {
        navigate('/projects-overview');
    };

    const handleSection3Click = () => {
        navigate('/kanban');
    };


    return (
        <div className={`dashboard transition-opacity duration-2000 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
            <Navbar /> {/* Include the Navbar component */}
            <div className="container mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">User Maintainance</h3>
                        <p>Details about Section 1...</p>
                        <button onClick={handleCreateUserClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                             Create User/Resource
                         </button>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">Project Maintainance</h3>
                        <p>Details about Section 2...</p>
                        <button onClick={handleCreateProjectClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                            Create New Project
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">Kanban Board</h3>
                        <p>Details about Section 3...</p>
                        <button onClick={handleSection3Click} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                            Kanban
                        </button>
                    </div>
                    {/* Add more sections as needed */}
                </div>
            </div>
        </div>
    );
}