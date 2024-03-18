import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserModal from './userModal';
import ResourceModal from './resourceModal';
import Navbar from './navbar';


export default function UserOverview() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(true);
    const [selectedResource, setSelectedResource] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', fadingOut: false });

    const [selectedItem, setSelectedItem] = useState(null);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);


    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/users/getall');
            console.log('User Data: ', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchResources = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/resources/getall');
            console.log('Resource Data: ', response.data);
            setResources(response.data);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        }
    };
    
    useEffect(() => {
        if (isSearchingUsers) {
            fetchUsers();
        } else {
            fetchResources();
        }
    }, [isSearchingUsers]);

    const filteredUsers = users.filter(user => {
        const fullName = `${user.name_first} ${user.name_second}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const filteredResources = resources.filter(resource => {
        const resourceName = `${resource.name_first} ${resource.name_second}`.toLowerCase();
        return resourceName.includes(searchTerm.toLowerCase());
    });

    const showNotification = (message) => {
        setNotification({ show: true, message, fadingOut: false }); // Immediately show the notification without fading out
        setTimeout(() => {
            // Start fading out after 2.5 seconds
            setNotification((prev) => ({ ...prev, fadingOut: true }));
            // Completely hide the notification after another 0.5 seconds, allowing the fade-out transition to complete
            setTimeout(() => {
                setNotification({ show: false, message: '', fadingOut: false });
            }, 500); // This timeout matches the CSS transition duration
        }, 2500); // Adjust this duration to control how long the notification stays fully visible
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleCreateClick = () => {
        navigate(isSearchingUsers ? '/create-user' : '/create-resource');
    };

    const toggleSearchType = () => {
        setIsSearchingUsers(!isSearchingUsers);
    };

    const handleSaveUser = async (updatedUserData) => {
        try {
            const response = await axios.put(`http://localhost:5001/api/users/update/${updatedUserData.iduser}`, updatedUserData);
            console.log(response.data);
            setIsModalOpen(false); // Close the modal
            fetchUsers(); // Refresh the user list
            showNotification("User saved successfully!"); // Show success notification
        } catch (error) {
            console.error('Error saving user:', error);
            showNotification("Failed to save user."); // Show error notification
        }
    };
    
    
    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:5001/api/users/delete/${userId}`);
            console.log(response.data);
            setIsModalOpen(false); // Close the modal

            fetchUsers(); // Refresh the user list
            showNotification("User deleted successfully!");
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification("Failed to delete user."); // Show error notification
        }
    };


    const handleSaveResource = async (resourceData) => {
        try {
            const response = await axios.put(`http://localhost:5001/api/resources/update/${resourceData.idresource}`, resourceData);
            console.log("Resource saved successfully", response.data);
            setIsResourceModalOpen(false); // Close the modal
            fetchResources(); // Refresh the resource list
            showNotification("Resource saved successfully!");
        } catch (error) {
            console.error('Failed to save resource:', error);
            showNotification("Failed to save resource.");
        }
    };
    
    const handleDeleteResource = async (resourceId) => {
        try {
            const response = await axios.delete(`http://localhost:5001/api/resources/delete/${resourceId}`);
            console.log("Resource deleted successfully", response.data);
            fetchResources(); // Refresh the resource list
            setIsResourceModalOpen(false); // Close the modal if open
            showNotification("Resource deleted successfully!");
        } catch (error) {
            console.error('Failed to delete resource:', error);
            showNotification("Failed to delete resource.");
        }
    };
      

    const openModal = (user) => {
        console.log('Selected user with ID:', user.iduser);
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const openResourceModal = (resource) => {
        setSelectedResource(resource);
        setIsResourceModalOpen(true);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handleBackClick}
                        className="py-2 px-4 bg-gray-300 hover:bg-gray-400 text-black font-bold rounded"
                    >
                        Back
                    </button>
                    <label htmlFor="toggleSearch" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input id="toggleSearch" type="checkbox" className="sr-only" onChange={toggleSearchType} checked={!isSearchingUsers} />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${isSearchingUsers ? 'translate-x-0' : 'translate-x-6'}`}></div>
                        </div>
                        <div className="ml-3 text-font-bold text-sm">
                            {isSearchingUsers ? 'Search Users' : 'Search Resources'}
                        </div>
                    </label>
                    <button
                        onClick={handleCreateClick}
                        className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    >
                        Add User/Resource
                    </button>
                </div>
                <input
                    type="text"
                    placeholder={`Search ${isSearchingUsers ? 'users' : 'resources'}...`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border p-2 w-full mb-4"
                />

                {/* User Table */}
                {isSearchingUsers && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Office</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Department</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">UserType</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={index} onClick={() => openModal(user)} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200`}>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            {`${user.name_first} ${user.name_second}`}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{user.office}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{user.department}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{user.user_type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Resources Table */}
                {!isSearchingUsers && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Office</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResources.map((resource, index) => (
                                    <tr key={index} onClick={() => openResourceModal(resource)} className={`cursor-pointer transition duration-300 ease-in-out ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-200`}>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                            {`${resource.name_first} ${resource.name_second}`}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{resource.department}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{resource.office}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{resource.role}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 text-sm">{resource.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {notification.show ? (
                    <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
                        <div className={`transition-opacity duration-1000 ease-in-out ${notification.show ? 'opacity-100' : 'opacity-0 pointer-events-none'} p-4 max-w-sm mx-auto bg-blue-500 text-white text-center rounded-lg shadow-lg`}>
                            {notification.message}
                        </div>
                    </div>
                ) : null}
                {isModalOpen && <UserModal user={selectedUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} onDelete={handleDeleteUser} />}
                {isResourceModalOpen && <ResourceModal resource={selectedResource} onClose={() => setIsResourceModalOpen(false)} onSave={handleSaveResource} onDelete={handleDeleteResource} />}
            </div>
        </> 
    );
}
