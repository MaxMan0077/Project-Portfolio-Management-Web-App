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
    const [selectedResourceId, setSelectedResourceId] = useState('');
    const [selectedBusinessOwnerId, setSelectedBusinessOwnerId] = useState('');
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
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
        const fetchResources = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/resources/getall');
                if (!response.ok) throw new Error('Network response was not ok');
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
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSelectResource = (id, type) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [type]: id  // Correctly map the ID to the right type (projectManager or businessOwner)
        }));
        if (type === 'projectManager') setSelectedResourceId(id);
        if (type === 'businessOwner') setSelectedBusinessOwnerId(id);
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);
    
        // Validation functions here
        const validateName = (name) => {
            if (!name) return "*Project name is required";
            if (name.length > 45) return "*Project name must not be more than 45 characters";
            return null;
        };
    
        const validateInteger = (value) => {
            if (!value) return "*This field is required";
            if (!/^\d+$/.test(value)) return "*Must be an integer";
            return null;
        };
    
        const validateDates = (start, end) => {
            if (!start || !end) return null; // We check for emptiness separately
            const startDate = new Date(start);
            const endDate = new Date(end);
            if (startDate >= endDate) return "*Start date must be before the end date";
            return null;
        };
    
        const validateRequired = (value) => {
            return value ? null : "*This field is required";
        };
    
        // Individual field validations
        let errors = {};
        errors.name = validateName(formData.name);
        errors.budgetApproved = validateInteger(formData.budgetApproved);
        errors.phaseStart = validateRequired(formData.phaseStart);
        errors.phaseEnd = validateRequired(formData.phaseEnd);
        errors.program = validateRequired(formData.program);
        errors.location = validateRequired(formData.location);
        errors.complexity = validateRequired(formData.complexity);
        errors.projectManager = validateRequired(formData.projectManager);
        errors.businessOwner = validateRequired(formData.businessOwner);
        errors.description = validateRequired(formData.description);
        errors.status = validateRequired(formData.status);
        errors.phase = validateRequired(formData.phase);
    
        const dateError = validateDates(formData.phaseStart, formData.phaseEnd);
        if (dateError) {
            errors.phaseStart = dateError;
            errors.phaseEnd = dateError;
        }
    
        // Filter out non-error entries
        Object.keys(errors).forEach(key => errors[key] === null && delete errors[key]);
    
        setFieldErrors(errors);
    
        if (Object.keys(errors).length > 0) {
            console.error("Form validation errors:", errors);
            return; // Prevent form submission if there are errors
        }
    
        // If all validations pass, map formData to snake_case keys for backend
        const mappedData = {
            name: formData.name,
            program: formData.program,
            location: formData.location,
            complexity: formData.complexity,
            project_manager: formData.projectManager,
            business_owner: formData.businessOwner,
            description: formData.description,
            status: formData.status,
            budget_approved: formData.budgetApproved,
            phase: formData.phase,
            phase_start: formData.phaseStart,
            phase_end: formData.phaseEnd
        };
    
        console.log('Submitting mappedData:', mappedData); // Log mappedData for debugging
    
        try {
            const response = await fetch('http://localhost:5001/api/projects/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappedData),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            navigate('/projects-overview');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };      

    const inputClass = (field) => `shadow appearance-none border ${!formData[field] && submitAttempted ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`;

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
                                className={inputClass('name')}
                                id="name"
                                name="name"
                                type="text"
                                placeholder={t('project_name_placeholder')}
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            {fieldErrors.name && <p className="text-red-500 text-xs italic">{fieldErrors.name}</p>}
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">
                                {t('program')}
                            </label>
                            <select
                                className={inputClass('program')}
                                id="program"
                                name="program"
                                value={formData.program}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_program')}</option>
                                <option value="internal">{t('internal')}</option>
                                <option value="external">{t('external')}</option>
                            </select>
                            {fieldErrors.program && <p className="text-red-500 text-xs italic">{fieldErrors.program}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                {t('location')}
                            </label>
                            <select
                                className={inputClass('location')}
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            >
                                <option value="">{t('select_location')}</option>
                                <option value="Americas">{t('Americas')}</option>
                                <option value="Europe">{t('Europe')}</option>
                                <option value="Asia-Pacific">{t('Asia-Pacific')}</option>
                                <option value="Middle-East & Africa">{t('Middle-East & Africa')}</option>
                            </select>
                            {fieldErrors.location && <p className="text-red-500 text-xs italic">{fieldErrors.location}</p>}
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complexity">
                                {t('complexity')}
                            </label>
                            <select
                                className={inputClass('complexity')}
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
                            {fieldErrors.complexity && <p className="text-red-500 text-xs italic">{fieldErrors.complexity}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectManager">
                                {t('project_manager')}
                            </label>
                            <Dropdown
                                resources={resources}
                                onSelect={(id) => handleSelectResource(id, 'projectManager')}
                                selectedResourceId={selectedResourceId}
                                isValid={!submitAttempted || selectedResourceId}
                            />
                            {fieldErrors.projectManager && <p className="text-red-500 text-xs italic">{fieldErrors.projectManager}</p>}
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessOwner">
                                {t('business_owner')}
                            </label>
                            <Dropdown
                                resources={resources}
                                onSelect={(id) => handleSelectResource(id, 'businessOwner')}
                                selectedResourceId={selectedBusinessOwnerId}
                                isValid={!submitAttempted || selectedBusinessOwnerId}
                            />
                            {fieldErrors.businessOwner && <p className="text-red-500 text-xs italic">{fieldErrors.businessOwner}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            {t('description')}
                        </label>
                        <textarea
                            className={inputClass('description')}
                            id="description"
                            name="description"
                            placeholder={t('project_description_placeholder')}
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                        {fieldErrors.description && <p className="text-red-500 text-xs italic">{fieldErrors.description}</p>}
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/2 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                {t('status')}
                            </label>
                            <select
                                className={inputClass('status')}
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
                            {fieldErrors.status && <p className="text-red-500 text-xs italic">{fieldErrors.status}</p>}
                        </div>
                        <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budgetApproved">
                                {t('budget_approved')} ($)
                            </label>
                            <input
                                className={inputClass('budgetApproved')}
                                id="budgetApproved"
                                name="budgetApproved"
                                type="text"
                                placeholder={t('budget_approved_placeholder')}
                                value={formData.budgetApproved}
                                onChange={handleInputChange}
                            />
                            {fieldErrors.budgetApproved && <p className="text-red-500 text-xs italic">{fieldErrors.budgetApproved}</p>}
                        </div>
                    </div>

                    <div className="flex mb-4">
                        <div className="w-1/3 mr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phase">
                                {t('project_phase')}
                            </label>
                            <select
                                className={inputClass('phase')}
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
                            {fieldErrors.phase && <p className="text-red-500 text-xs italic">{fieldErrors.phase}</p>}
                        </div>
                        <div className="w-1/3 mx-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseStart">
                                {t('phase_start_date')}
                            </label>
                            <input
                                className={inputClass('phaseStart')}
                                id="phaseStart"
                                name="phaseStart"
                                type="date"
                                value={formData.phaseStart}
                                onChange={handleInputChange}
                            />
                            {fieldErrors.phaseStart && <p className="text-red-500 text-xs italic">{fieldErrors.phaseStart}</p>}
                        </div>
                        <div className="w-1/3 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phaseEnd">
                                {t('phase_end_date')}
                            </label>
                            <input
                                className={inputClass('phaseEnd')}
                                id="phaseEnd"
                                name="phaseEnd"
                                type="date"
                                value={formData.phaseEnd}
                                onChange={handleInputChange}
                            />
                            {fieldErrors.phaseEnd && <p className="text-red-500 text-xs italic">{fieldErrors.phaseEnd}</p>}
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
