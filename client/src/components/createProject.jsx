import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useIntl } from 'react-intl';
import Dropdown from './dropdown';

export default function CreateProject() {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const t = (id) => formatMessage({ id });
    const [resources, setResources] = useState([]);
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const [selectedBusinessOwnerId, setSelectedBusinessOwnerId] = useState(null);
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

    useEffect(() => {
        // Fetch resources when the component mounts
        const fetchResources = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/resources/getall');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchResources();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectProjectManager = (selectedId) => {
        setSelectedResourceId(selectedId);
        console.log('Selected ID:', selectedId); // Log the selected ID for debugging
        // Update the formData state to include the selected project manager's idresource
        setFormData(prevFormData => ({
            ...prevFormData,
            projectManager: selectedId, // Assuming this is the correct field for the project manager's ID
        }));
    };    

    const handleSelectBusinessOwner = (selectedId) => {
        setSelectedBusinessOwnerId(selectedId);
        setFormData(prevFormData => ({
            ...prevFormData,
            businessOwner: selectedId,
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
        <>
            <Navbar />
            <div className="container mx-auto p-8">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('create_new_project')}</h2>
    
                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                {t('project_name')}
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                name="name"
                                type="text"
                                placeholder={t('project_name_placeholder')}
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">
                                {t('program')}
                            </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="program"
                                name="program"
                                value={formData.program}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_program')}</option>
                                <option value="internal">{t('internal')}</option>
                                <option value="external">{t('external')}</option>
                            </select>
                        </div>
                    </div>
    
                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                {t('location')}
                            </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_location')}</option>
                                <option value="1">{t('location_1')}</option>
                                <option value="2">{t('location_2')}</option>
                            </select>
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complexity">
                                {t('complexity')}
                            </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="complexity"
                                name="complexity"
                                value={formData.complexity}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_complexity')}</option>
                                <option value="low">{t('low')}</option>
                                <option value="medium">{t('medium')}</option>
                                <option value="high">{t('high')}</option>
                            </select>
                        </div>
                    </div>
    
                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManager">
                                {t('project_manager')}
                            </label>
                            <Dropdown
                                resources={resources}
                                onSelect={handleSelectProjectManager}
                                selectedResourceId={selectedResourceId}
                            />
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwner">
                                {t('business_owner')}
                            </label>
                            <Dropdown
                                resources={resources}
                                onSelect={handleSelectBusinessOwner}
                                selectedResourceId={selectedBusinessOwnerId}
                            />
                        </div>
                    </div>
    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            {t('description')}
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            name="description"
                            placeholder={t('project_description_placeholder')}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>
    
                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                {t('status')}
                            </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_status')}</option>
                                <option value="Red">{t('Red')}</option>
                                <option value="Amber">{t('Amber')}</option>
                                <option value="Green">{t('Green')}</option>
                            </select>
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budgetApproved">
                                {t('budget_approved')}
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="budgetApproved"
                                name="budgetApproved"
                                type="text"
                                placeholder={t('budget_approved_placeholder')}
                                value={formData.budgetApproved}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
    
                    <div className="flex mb-4">
                        <div className="w-1/3 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phase">
                                {t('project_phase')}
                            </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phase"
                                name="phase"
                                value={formData.phase}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_phase')}</option>
                                <option value="Funnel">{t('funnel')}</option>
                                <option value="Review & Evaluation">{t('review_evaluation')}</option>
                                <option value="Business Case Development">{t('business_case_development')}</option>
                                <option value="In Implementation">{t('in_implementation')}</option>
                                <option value="Closed">{t('closed')}</option>
                            </select>
                        </div>
                        <div className="w-1/3 mx-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseStart">
                                {t('phase_start_date')}
                            </label>
                            <input
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phaseStart"
                                name="phaseStart"
                                type="date"
                                value={formData.phaseStart}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-1/3 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseEnd">
                                {t('phase_end_date')}
                            </label>
                            <input
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phaseEnd"
                                name="phaseEnd"
                                type="date"
                                value={formData.phaseEnd}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
    
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {t('create_project')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );    
}
