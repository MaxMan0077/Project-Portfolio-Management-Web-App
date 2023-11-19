import React, { useState } from "react";

export default function UserCreate() {
    const [formType, setFormType] = useState('user'); // 'user' or 'resource'

    const toggleFormType = () => {
        setFormType(formType === 'user' ? 'resource' : 'user');
    };

    return (
        <div className="container mx-auto p-8">
            {/* Toggle Switch */}
            <div className="flex justify-center mb-8">
                <label className="form-check-label inline-block text-gray-800 mr-2">
                    {formType === 'user' ? 'User' : 'Resource'}
                </label>
                <input className="form-check-input appearance-none w-9 rounded-full h-5 bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={toggleFormType} checked={formType === 'resource'} />
            </div>

            {/* Conditional Form Rendering */}
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    {formType === 'user' ? (
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">Create User</h2>
                            {/* First Name & Surname */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name"/>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                                        Surname
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="surname" type="text" placeholder="Surname"/>
                                </div>
                            </div>

                            {/* Username & Password */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"/>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Password"/>
                                </div>
                            </div>

                            {/* Office & Department */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="office">
                                        Office
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="office" type="text" placeholder="Office"/>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                        Department
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="department" type="text" placeholder="Department"/>
                                </div>
                            </div>

                            {/* UserType & Photo Upload */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
                                    User Type
                                </label>
                                <select className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="userType">
                                    {/* Add options for user types here */}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                                    Upload Photo
                                </label>
                                <input type="file" id="photo" className="shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Create User
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            {/* Resource Form */}
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">Create Resource</h2>
                            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">Create Resource</h2>
                            {/* First Name & Surname */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name"/>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                                        Surname
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="surname" type="text" placeholder="Surname"/>
                                </div>
                            </div>

                            {/* Office & Department */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="office">
                                        Office
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="office" type="text" placeholder="Office"/>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                        Department
                                    </label>
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="department" type="text" placeholder="Department"/>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                    Role
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="role" type="text" placeholder="Role"/>
                            </div>

                            {/* Photo Upload */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                                    Upload Photo
                                </label>
                                <input type="file" id="photo" className="shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                    Create Resource
                                </button>
                            </div>
                        </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
