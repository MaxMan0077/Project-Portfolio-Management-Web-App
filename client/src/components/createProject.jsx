import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        program: '',
        location: '',
        complexity: '',
        projectManager: '',
        businessOwner: '',
        description: '',
        status: '',
        budgetApproved: '',
        phase: '',
        phaseStart: '',
        phaseEnd: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Convert formData keys from camelCase to snake_case
        const formattedData = {
            name: formData.name,
            program: formData.program,
            location: parseInt(formData.location),
            complexity: formData.complexity,
            project_manager: parseInt(formData.projectManager),
            business_owner: parseInt(formData.businessOwner),
            description: formData.description,
            status: formData.status,
            budget_approved: parseFloat(formData.budgetApproved),
            phase: formData.phase,
            phase_start: formData.phaseStart,
            phase_end: formData.phaseEnd,
        };
        console.log('Formatted data:', formattedData);
    
        try {
            const response = await fetch('http://localhost:5001/api/projects/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('Project created:', data);
            navigate('/projects-overview'); // Navigate to the projects overview page on success
        } catch (error) {
            console.error('Error creating project:', error);
            // Optionally handle error (show error message)
        }
    };    
    

    return (
        <div className="container mx-auto p-8">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Create New Project</h2>

                {/* First Line: Name and Program */}
                <div className="flex mb-4">
                    <div className="w-1/2 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="name"
                            type="text"
                            placeholder="Project Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-1/2 ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">
                            Program
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="program"
                            value={formData.program}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Program</option>
                            {/* Populate with program options */}
                            <option value="high">Internal</option>
                        </select>
                    </div>
                </div>

                {/* Second Line: Location and Complexity */}
                <div className="flex mb-4">
                    {/* Location */}
                    <div className="w-1/2 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                            Location
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Location</option>
                            {/* Populate with location options */}
                            <option value="1">1</option>
                        </select>
                    </div>
                    {/* Complexity Dropdown */}
                    <div className="w-1/2 ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complexity">
                            Complexity
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="complexity"
                            value={formData.complexity}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Complexity</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                {/* Third Line: Project Manager and Business Owner */}
                <div className="flex mb-4">
                    {/* Project Manager Dropdown */}
                    <div className="w-1/2 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManager">
                            Project Manager
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="projectManager"
                            value={formData.projectManager}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Project Manager</option>
                            {/* Populate with project manager options */}
                            <option value="1">1</option>
                        </select>
                    </div>
                    {/* Business Owner Dropdown */}
                    <div className="w-1/2 ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwner">
                            Business Owner
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="businessOwner"
                            value={formData.businessOwner}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Business Owner</option>
                            {/* Populate with business owner options */}
                            <option value="1">1</option>
                        </select>
                    </div>
                </div>

                {/* Fourth Line: Description */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="description"
                        placeholder="Project Description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Fifth Line: Status Dropdown and Budget Approved */}
                <div className="flex mb-4">
                    {/* Status Dropdown */}
                    <div className="w-1/2 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Status</option>
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    {/* Budget Approved */}
                    <div className="w-1/2 ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budgetApproved">
                            Budget Approved
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            name="budgetApproved"
                            type="text"
                            placeholder="Budget Approved"
                            value={formData.budgetApproved}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="flex mb-4">
                    {/* Project Phase Dropdown */}
                    <div className="w-1/3 mr-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phase">
                        Project Phase
                        </label>
                        <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="phase"
                        value={formData.phase}
                        onChange={handleInputChange}
                        >
                        <option value="">Select Phase</option>
                        <option value="planning">Planning</option>
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="testing">Testing</option>
                        <option value="deployment">Deployment</option>
                        </select>
                    </div>

                    {/* Phase Start Date Input */}
                    <div className="w-1/3 mx-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseStart">
                        Phase Start Date
                        </label>
                        <input
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="phaseStart"
                        type="date"
                        value={formData.phaseStart}
                        onChange={handleInputChange}
                        />
                    </div>

                    {/* Phase End Date Input */}
                    <div className="w-1/3 ml-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseEnd">
                        Phase End Date
                        </label>
                        <input
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="phaseEnd"
                        type="date"
                        value={formData.phaseEnd}
                        onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    );
}
