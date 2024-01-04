import React, { useState } from "react";
import axios from 'axios';

export default function UserCreate() {
    const [formData, setFormData] = useState({
        name_first: '',
        name_second: '',
        office: '',
        department: '',
        user_type: '',
        photo: null,
        username: '',
        password: ''
    });
    const [formType, setFormType] = useState('user'); // 'user' or 'resource'

    const toggleFormType = () => {
        setFormType(formType === 'user' ? 'resource' : 'user');
    };

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
    
        console.log("Form Data: ", formData); // Log the formData
    
        try {
            const response = await axios.post('http://localhost:5000/api/users', data);
            console.log(response.data);
            // Handle response here
        } catch (error) {
            console.error('Error creating user:', error);
            // Handle error here
        }
    };
    

    return (
        <div className="container mx-auto p-8">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Create User</h2>

                {/* Firstname & lastname */}
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

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>
    );
}
