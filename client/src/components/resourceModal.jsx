import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PhotographIcon } from '@heroicons/react/outline';

const ResourceModal = ({ resource, onClose, onSave, onDelete }) => {
    const [resourceData, setResourceData] = useState(resource || {});

    useEffect(() => {
        setResourceData(resource);
    }, [resource]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResourceData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveClick = async () => {
        if (!resourceData.idresource) { // Adjust if the ID property name is different
          console.error('Resource ID is undefined');
          return;
        }
    
        onSave(resourceData); // Make sure onSave properly handles the PUT request
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                {/* Photo at the top of the modal */}
                <div className="flex justify-center mb-4">
                    {resourceData.photo ? (
                        <img
                            src={resourceData.photo}
                            alt="Resource"
                            className="h-24 w-24 object-cover rounded-full border-2 border-gray-300"
                        />
                    ) : (
                        <div className="rounded-full bg-gray-300 p-4">
                            <PhotographIcon className="h-16 w-16 text-gray-600" />
                        </div>
                    )}
                </div>

                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">Resource Details</h3>
                    <form className="space-y-3">
                        {/* First Name */}
                        <div className="space-y-1">
                            <label htmlFor="name_first" className="block text-sm font-bold text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="name_first"
                                value={resourceData.name_first || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-1">
                            <label htmlFor="name_second" className="block text-sm font-bold text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="name_second"
                                value={resourceData.name_second || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Native Name */}
                        <div className="space-y-1">
                            <label htmlFor="name_native" className="block text-sm font-bold text-gray-700">Native Name</label>
                            <input
                                type="text"
                                name="name_native"
                                value={resourceData.name_native || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Office */}
                        <div className="space-y-1">
                            <label htmlFor="office" className="block text-sm font-bold text-gray-700">Office</label>
                            <input
                                type="text"
                                name="office"
                                value={resourceData.office || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Department */}
                        <div className="space-y-1">
                            <label htmlFor="department" className="block text-sm font-bold text-gray-700">Department</label>
                            <input
                                type="text"
                                name="department"
                                value={resourceData.department || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-1">
                            <label htmlFor="role" className="block text-sm font-bold text-gray-700">Role</label>
                            <input
                                type="text"
                                name="role"
                                value={resourceData.role || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Type */}
                        <div className="space-y-1">
                            <label htmlFor="type" className="block text-sm font-bold text-gray-700">Type</label>
                            <input
                                type="text"
                                name="type"
                                value={resourceData.type || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </form>
                </div>
                <div className="mt-5 sm:mt-6">
                    <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        onClick={handleSaveClick}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3"
                        onClick={() => onDelete(resourceData.idresource)} // Adjust to match your resource ID field name
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm mt-3"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceModal;
