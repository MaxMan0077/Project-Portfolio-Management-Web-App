import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';

export default function UserCreate() {
    const initialUserFormData = {
        name_first: '',
        name_second: '',
        office: '',
        department: '',
        user_type: '',
        photo: null,
        username: '',
        password: ''
    };

    const initialResourceFormData = {
        name_first: '',
        name_second: '',
        name_native: '',
        office: '',
        department: '',
        role: '',
        photo: null,
        type: ''
    };

    const [formData, setFormData] = useState(initialUserFormData);
    const [formType, setFormType] = useState('user'); // 'user' or 'resource'

    const toggleFormType = () => {
        setFormType(formType === 'user' ? 'resource' : 'user');
        setFormData(formType === 'user' ? initialResourceFormData : initialUserFormData);
    };

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const endpoint = formType === 'user' ? 'http://localhost:5001/api/users/register' : 'http://localhost:5001/api/resources/add';
        const data = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            data.append(key, value);
        }

        try {
            const response = await axios.post(endpoint, data);
            console.log(response.data);
            // Additional handling based on response
        } catch (error) {
            console.error('Error:', error);
            // Error handling
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-8">
                {/* Toggle Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={toggleFormType}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Switch to {formType === 'user' ? 'Create Resource' : 'Create User'}
                    </button>
                </div>
        
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                        {formType === 'user' ? 'Create User' : 'Create Resource'}
                    </h2>
        
                    {formType === 'user' ? (
                        // User Form Fields
                        <div>
                            {/* Firstname & Lastname */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_first">
                                        First Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="name_first"
                                        type="text"
                                        placeholder="First Name"
                                        value={formData.name_first}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_second">
                                        Last Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="name_second"
                                        type="text"
                                        placeholder="Last Name"
                                        value={formData.name_second}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            
                            {/* Username & Password */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
        
                            {/* Office & Department */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="office">
                                        Office
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="office"
                                        type="text"
                                        placeholder="Office"
                                        value={formData.office}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                        Department
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="department"
                                        type="text"
                                        placeholder="Department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
        
                            {/* User Type */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
                                    User Type
                                </label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    name="user_type"
                                    value={formData.user_type}
                                    onChange={handleInputChange}
                                >
                                    {/* Add options for user types here */}
                                    <option value="">Select User Type</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
        
                            {/* Photo Upload */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                                    Upload Photo
                                </label>
                                <input
                                    type="file"
                                    name="photo"
                                    className="shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    ) : (
                        // Resource Form Fields
                        <div>
                            {/* First Name, Second Name, and Native Translation */}
                            <div className="flex mb-4">
                                <div className="w-1/3 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceFirstName">
                                        First Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="resourceFirstName"
                                        type="text"
                                        placeholder="First Name"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-1/3 mx-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceSecondName">
                                        Second Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="resourceSecondName"
                                        type="text"
                                        placeholder="Second Name"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-1/3 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nativeTranslation">
                                        Native Translation
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="nativeTranslation"
                                        type="text"
                                        placeholder="Native Translation"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Office & Department */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceOffice">
                                        Office
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="resourceOffice"
                                        type="text"
                                        placeholder="Office"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resourceDepartment">
                                        Department
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="resourceDepartment"
                                        type="text"
                                        placeholder="Department"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Role Dropdown */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                        Role
                                    </label>
                                    <select
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="role"
                                        value={formData.role} // Set the value here
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                        Internal/External
                                    </label>
                                    <select
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="internal">Internal</option>
                                        <option value="external">External</option>
                                    </select>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                                    Upload Photo
                                </label>
                                <input
                                    type="file"
                                    name="photo"
                                    className="shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}
        
                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {formType === 'user' ? 'Create User' : 'Create Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
