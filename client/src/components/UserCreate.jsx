import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import { useIntl } from 'react-intl';

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
    const location = useLocation();
    const navigate = useNavigate();
    const [formType] = useState(location.state?.formType || 'user');
    const { formatMessage } = useIntl(); // useIntl hook to format messages
    const t = (id) => formatMessage({ id });
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);


    useEffect(() => {
        // Deep copy the initial form data to reset properly on form type change
        setFormData(formType === 'user' ? {...initialUserFormData} : {...initialResourceFormData});
    }, [formType]);

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);
    
        const validateNameFirst = (name) => {
            if (!name) return "*First name is required";
            if (/[^a-zA-Z\- ]/.test(name)) return "*Name must not contain numbers or special characters";
            if (name.length > 50) return "*Name must be no more than 50 characters";
            return null;
        };

        const validateNameSecond = (name) => {
            if (!name) return "*Surname is required";
            if (/[^a-zA-Z\- ]/.test(name)) return "*Name must not contain numbers or special characters";
            if (name.length > 50) return "*Name must be no more than 50 characters";
            return null;
        };

        const validateNameNative = (name) => {
            if (!name) return "*Surname is required";
            if (/[^a-zA-Z\- ]/.test(name)) return "*Name must not contain numbers or special characters";
            if (name.length > 50) return "*Name must be no more than 50 characters";
            return null;
        };
    
        const validateUsername = (username) => {
            if (!username) return "*Username is required";
            if (!/^[a-zA-Z0-9]+$/.test(username)) return "*Username must be alphanumeric";
            return null;
        };
    
        const validatePassword = (password) => {
            if (!password) return "*Password is required";
            if (/\s|_/.test(password)) return "*Password must not contain spaces or underscores";
            if (!/[A-Z]/.test(password) || !/\d/.test(password) || password.length < 8) 
                return "*Password must contain at least one uppercase letter, one number, and be at least 8 characters long";
            return null;
        };

        const validateNativeTranslation = (name) => {
            if (name && /\d/.test(name)) return "*Native translation must not contain numbers";
            return null;
        };
    
        const validateGeneric = (value) => {
            if (!value) return "*Field is required";
            return null;
        };
    
        // Field-specific error checking
        let newErrors = {};
        if (formType === 'user'){
            newErrors.name_first = validateNameFirst(formData.name_first);
            newErrors.name_second = validateNameSecond(formData.name_second);
            newErrors.username = validateUsername(formData.username);
            newErrors.password = validatePassword(formData.password);
            newErrors.office = validateGeneric(formData.office);
            newErrors.department = validateGeneric(formData.department);
            newErrors.user_type = validateGeneric(formData.user_type);
            newErrors.photo = validateGeneric(formData.photo);
        } else {
            newErrors.resourceFirstName = validateNameFirst(formData.resourceFirstName);
            newErrors.resourceSecondName = validateNameSecond(formData.resourceSecondName);
            newErrors.nativeTranslation = validateNativeTranslation(formData.nativeTranslation);
            newErrors.resourceOffice = validateGeneric(formData.resourceOffice);
            newErrors.resourceDepartment = validateGeneric(formData.resourceDepartment);
            newErrors.role = validateGeneric(formData.role);
            newErrors.type = validateGeneric(formData.type);
            newErrors.photo = validateGeneric(formData.photo);
        }

        // Remove any null entries (no errors)
        Object.keys(newErrors).forEach(key => {
            if (newErrors[key] === null) delete newErrors[key];   
        });
    
        // Set error state
        setFieldErrors(newErrors);
    
        // If there are errors, do not proceed with form submission
        if (Object.keys(newErrors).length > 0) {
            console.error("Form validation errors:", newErrors);
            return;
        }
    
        const endpoint = formType === 'user' ? 'http://localhost:5001/api/users/register' : 'http://localhost:5001/api/resources/add';
        const data = new FormData();
    
        // Append all form data
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    
        // Try to submit the form
        try {
            const response = await axios.post(endpoint, data);
            console.log('Submission Response:', response.data);
            navigate('/user-overview', { state: { formType }});
        } catch (error) {
            console.error('Error during form submission:', error);
            setFieldErrors({ formError: 'Failed to submit form, please try again later.' });
        }
    };         

    const handleCancel = () => {
        navigate('/user-overview', { state: { formType } });
    };

    const inputClass = (key) => {
        const baseClass = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
        if (submitAttempted && fieldErrors[key]) {
            return `${baseClass} border-red-500`; // Apply red border if there's an error
        }
        return `${baseClass} border-gray-300`; // Default border color
    };
    
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-8">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">
                        {formType === 'user' ? t('create_user') : t('create_resource')}
                    </h2>
    
                    {formType === 'user' ? (
                        // User Form Fields
                        <>
                            {/* Firstname & Lastname */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_first">
                                        {t('first_name')}
                                    </label>
                                    <input
                                        className={inputClass('name_first')}
                                        name="name_first"
                                        type="text"
                                        placeholder={t('first_name')}
                                        value={formData.name_first}
                                        onChange={handleInputChange}
                                    />
                                    {fieldErrors.name_first && <span className="text-red-500 text-xs italic">{fieldErrors.name_first}</span>}
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_second">
                                        {t('surname')}
                                    </label>
                                    <input
                                        className={inputClass('name_second')}
                                        name="name_second"
                                        type="text"
                                        placeholder={t('surname')}
                                        value={formData.name_second}
                                        onChange={handleInputChange}
                                    />
                                    {fieldErrors.name_second && <span className="text-red-500 text-xs italic">{fieldErrors.name_second}</span>}
                                </div>
                            </div>
                            {/* Username & Password */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                        {t('username')}
                                    </label>
                                    <input
                                        className={inputClass('username')}
                                        name="username"
                                        type="text"
                                        placeholder={t('username')}
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    {fieldErrors.username && <span className="text-red-500 text-xs italic">{fieldErrors.username}</span>}
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                        {t('password')}
                                    </label>
                                    <input
                                        className={inputClass('password')}
                                        name="password"
                                        type="password"
                                        placeholder={t('password')}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    {fieldErrors.password && <span className="text-red-500 text-xs italic">{fieldErrors.password}</span>}
                                </div>
                            </div>
        
                            {/* Office & Department */}
                            <div className="flex mb-4">
                                <div className="w-1/2 mr-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="office">
                                        {t('office')}
                                    </label>
                                    <select
                                        className={inputClass('office')}
                                        name="office"
                                        value={formData.office}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">{t('office')}</option>
                                        <option value="1">London</option>
                                        <option value="2">New York</option>
                                        <option value="3">Shanghai</option>
                                        <option value="4">Brisbane</option>
                                        <option value="5">Cape Town</option>
                                    </select>
                                    {fieldErrors.office && <span className="text-red-500 text-xs italic">{fieldErrors.office}</span>}
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                        {t('department')}
                                    </label>
                                    <select
                                        className={inputClass('department')}
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">{t('department')}</option>
                                        <option value="Information Technology">{t('Information Technology')}</option>
                                        <option value="Development">{t('Development')}</option>
                                        <option value="Human Resources">{t('Human Resources')}</option>
                                        <option value="Change Management">{t('Change Management')}</option>
                                        <option value="Front Office">{t('Front Office')}</option>
                                        <option value="Back Office">{t('Back Office')}</option>
                                    </select>
                                    {fieldErrors.department && <span className="text-red-500 text-xs italic">{fieldErrors.department}</span>}
                                </div>
                            </div>
        
                            {/* User Type */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_type">
                                    {t('user_type')}
                                </label>
                                <select
                                    className={inputClass('user_type')}
                                    name="user_type"
                                    value={formData.user_type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">{t('select_user_type')}</option>
                                    <option value="admin">{t('admin')}</option>
                                    <option value="user">{t('user')}</option>
                                </select>
                                {fieldErrors.user_type && <span className="text-red-500 text-xs italic">{fieldErrors.user_type}</span>}
                            </div>
        
                            {/* Photo Upload */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                                    {t('upload_photo')}
                                </label>
                                <input
                                    type="file"
                                    name="photo"
                                    className={inputClass('photo')}
                                    onChange={handleInputChange}
                                />
                                {fieldErrors.photo && <span className="text-red-500 text-xs italic">{fieldErrors.photo}</span>}
                            </div>
                        </>
                    ) : (
                        // Resource Form Fields
                        <div>
                        {/* First Name, Second Name (Surname), and Native Translation */}
                        <div className="flex mb-4">
                            {["resourceFirstName", "resourceSecondName", "nativeTranslation"].map((field, index) => (
                                <div className={`w-1/3 ${index !== 1 ? "mr-2" : "mx-2"}`} key={field}>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                                        {field === "resourceSecondName" ? t('surname') : t(field)}
                                    </label>
                                    <input
                                        className={inputClass(field)}
                                        name={field}
                                        type="text"
                                        placeholder={field === "resourceSecondName" ? t('surname') : t(`${field}_placeholder`)}
                                        onChange={handleInputChange}
                                        value={formData[field]}
                                    />
                                    {fieldErrors[field] && <span className="text-red-500 text-xs italic">{fieldErrors[field]}</span>}
                                </div>
                            ))}
                        </div>

                        {/* Office & Department */}
                        <div className="flex mb-4">
                            {["resourceOffice", "resourceDepartment"].map((field, index) => (
                                <div className={`w-1/2 ${index === 0 ? "mr-2" : "ml-2"}`} key={field}>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                                        {t(field)}
                                    </label>
                                    {field === "resourceOffice" ? (
                                        <select
                                            className={inputClass(field)}
                                            name={field}
                                            onChange={handleInputChange}
                                            value={formData[field]}
                                        >
                                            <option value="">{t('select_office')}</option>
                                            <option value="1">{t('London')}</option>
                                            <option value="2">{t('New York')}</option>
                                            <option value="3">{t('Shanghai')}</option>
                                            <option value="4">{t('Brisbane')}</option>
                                            <option value="5">{t('Cape Town')}</option>
                                        </select>
                                    ) : (
                                        <select
                                            className={inputClass(field)}
                                            name={field}
                                            onChange={handleInputChange}
                                            value={formData[field]}
                                        >
                                            <option value="">{t('department')}</option>
                                            <option value="Information Technology">{t('Information Technology')}</option>
                                            <option value="Development">{t('Development')}</option>
                                            <option value="Human Resources">{t('Human Resources')}</option>
                                            <option value="Change Management">{t('Change Management')}</option>
                                            <option value="Front Office">{t('Front Office')}</option>
                                            <option value="Back Office">{t('Back Office')}</option>
                                        </select>
                                    )}
                                    {fieldErrors[field] && <span className="text-red-500 text-xs italic">{fieldErrors[field]}</span>}
                                </div>
                            ))}
                        </div>

                        {/* Role & Type */}
                        <div className="flex mb-4">
                            <div className="w-1/2 mr-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                    {t("role")}
                                </label>
                                <select
                                    className={inputClass('role')}
                                    name="role"
                                    onChange={handleInputChange}
                                    value={formData['role']}
                                >
                                    <option value="">{t("select_role")}</option>
                                    <option value="admin">{t("admin")}</option>
                                    <option value="user">{t("user")}</option>
                                </select>
                                {fieldErrors['role'] && <span className="text-red-500 text-xs italic">{fieldErrors['role']}</span>}
                            </div>
                            <div className="w-1/2 ml-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                    {t("type")}
                                </label>
                                <select
                                    className={inputClass('type')}
                                    name="type"
                                    onChange={handleInputChange}
                                    value={formData['type']}
                                >
                                    <option value="">{t("select_type")}</option>
                                    <option value="internal">{t("internal")}</option>
                                    <option value="external">{t("external")}</option>
                                </select>
                                {fieldErrors['type'] && <span className="text-red-500 text-xs italic">{fieldErrors['type']}</span>}
                            </div>
                        </div>
    
                        {/* Photo Upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                                {t('upload_photo')}
                            </label>
                            <input
                                type="file"
                                name="photo"
                                className={inputClass('photo')}
                                onChange={handleInputChange}
                            />
                            {fieldErrors['photo'] && <span className="text-red-500 text-xs italic">{fieldErrors['photo']}</span>}
                        </div>
                    </div>
                    )}
                    {/* Submit Button */}
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                        {/* Save Button */}
                        <button
                            type="submit"
                            className="w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            {t('save')}
                        </button>

                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={handleCancel}  // Assuming handleCancel is your method to handle the cancel action
                            className="mt-3 w-full inline-flex justify-center px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            style={{ textDecoration: 'none' }}
                            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </> 
    );    
}