import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [isFadingIn, setIsFadingIn] = useState(false);

    useEffect(() => {
        setIsFadingIn(true); // Trigger the fade-in effect
    }, []); // Empty array ensures this effect only runs once on mount

    const handleCreateUserClick = () => {
        navigate('/create-user');
    };

    const handleCreateProjectClick = () => {
        navigate('/create-project');
    };

    return (
        <div className={`dashboard transition-opacity duration-2000 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
            <nav className="bg-gray-800 p-4 text-white">
                <div className="container mx-auto">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </div>
            </nav>
            <div className="container mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">Section 1</h3>
                        <p>Details about Section 1...</p>
                        <button onClick={handleCreateUserClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                             Create User/Resource
                         </button>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">Section 2</h3>
                        <p>Details about Section 2...</p>
                        <button onClick={handleCreateProjectClick} className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                            Create New Project
                        </button>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">Section 3</h3>
                        <p>Details about Section 3...</p>
                    </div>
                    {/* Add more sections as needed */}
                </div>
            </div>
        </div>
    );
}