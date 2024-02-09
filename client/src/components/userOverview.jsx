import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserModal from './userModal';

export default function UserOverview() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isSearchingUsers, setIsSearchingUsers] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/getall');
            console.log('User Data: ', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    useEffect(() => {
        if (isSearchingUsers) {
            fetchUsers();
        }
    }, [isSearchingUsers]);

    const filteredUsers = users.filter(user => {
        const fullName = `${user.name_first} ${user.name_second}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

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
            const response = await axios.put(`http://localhost:5000/api/users/update/${updatedUserData.iduser}`, updatedUserData);
            console.log(response.data);
            setIsModalOpen(false); // Close the modal
            
            // Refresh the user list to reflect the changes.
            fetchUsers(); // Assuming fetchUsers is a function that gets the updated list of users from the server
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    
    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/users/delete/${userId}`);
            console.log(response.data);
            setIsModalOpen(false); // Close the modal
            
            // Refresh the user list to reflect the deletion
            fetchUsers(); // Re-fetch the user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };    

    const openModal = (user) => {
        console.log('Selected user with ID:', user.iduser);
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    // Dummy resources data
    const [resources, setResources] = useState([
        { name: 'Resource One', department: 'Finance', office: 'London', role: 'Analyst', type: 'External' },
        { name: 'Resource Two', department: 'IT', office: 'New York', role: 'Developer', type: 'Internal' },
        // Add more resource objects as needed
    ]);

    return (
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
                            {resources.map((resource, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                    <td className="px-5 py-5 border-b border-gray-200 text-sm">{resource.name}</td>
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
            {isModalOpen && <UserModal user={selectedUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} onDelete={handleDeleteUser} />}
            {/* Implement filters, search results, and rows with alternating colors here */}
            {/* This placeholder section should be replaced with actual search logic and rendering */}
        </div>
    );
}
