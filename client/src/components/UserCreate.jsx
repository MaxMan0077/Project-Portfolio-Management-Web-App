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
    
        // Define required fields for each form type
        const requiredUserFields = ['name_first', 'name_second', 'username', 'password', 'office', 'department', 'user_type', 'photo'];
        const requiredResourceFields = ['resourceFirstName', 'resourceSecondName', 'nativeTranslation', 'resourceOffice', 'resourceDepartment', 'role', 'type', 'photo'];
    
        // Determine which fields to check based on formType
        const requiredFields = formType === 'user' ? requiredUserFields : requiredResourceFields;
    
        // Log formData to console before validation
        console.log("Current formData:", formData);
    
        // Check if all required fields for the active form type are filled
        if (requiredFields.some(field => !formData[field] || formData[field] === '')) {
            console.error("All fields are required.");
            return;
        }
    
        const endpoint = formType === 'user' ? 'http://localhost:5001/api/users/register' : 'http://localhost:5001/api/resources/add';
        const data = new FormData();
    
        for (const field of requiredFields) {
            data.append(field, formData[field]);
            // Log each field being appended to FormData
            console.log(`Appending to FormData: ${field} =`, formData[field]);
        }
    
        try {
            const response = await axios.post(endpoint, data);
            console.log('Submission Response:', response.data);
            navigate('/user-overview', { state: { formType }});
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };    

    const handleCancel = () => {
        // Ensure the correct formType is being passed back to UserOverview
        navigate('/user-overview', { state: { formType } });
    };

    const inputClass = (key) => `shadow appearance-none border ${submitAttempted && !formData[key] ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`;

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
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name_second">
                                        {t('last_name')}
                                    </label>
                                    <input
                                        className={inputClass('name_second')}
                                        name="name_second"
                                        type="text"
                                        placeholder={t('last_name')}
                                        value={formData.name_second}
                                        onChange={handleInputChange}
                                    />
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
                                        <option value="">{t('select_office')}</option>
                                        <option value="1">London</option>
                                        <option value="2">New York</option>
                                        <option value="3">Shanghai</option>
                                        <option value="4">Brisbane</option>
                                        <option value="5">Cape Town</option>
                                    </select>
                                </div>
                                <div className="w-1/2 ml-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                        {t('department')}
                                    </label>
                                    <input
                                        className={inputClass('department')}
                                        name="department"
                                        type="text"
                                        placeholder={t('department')}
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    />
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
                            </div>
                        </>
                    ) : (
                        // Resource Form Fields
                        <div>
                        {/* First Name, Second Name, and Native Translation */}
                        <div className="flex mb-4">
                            {["resourceFirstName", "resourceSecondName", "nativeTranslation"].map((field, index) => (
                            <div className={`w-1/3 ${index !== 1 ? "mr-2" : "mx-2"}`} key={field}>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                                {t(field)}
                                </label>
                                <input
                                className={inputClass(field)}
                                name={field}
                                type="text"
                                placeholder={t(`${field}_placeholder`)}
                                onChange={handleInputChange}
                                />
                            </div>
                            ))}
                        </div>
    
                        {/* Office & Department */}
                        <div className="flex mb-4">
                            {["resourceOffice", "resourceDepartment"].map((field, index) => {
                                if (field === "resourceOffice") {
                                    return (
                                        <div className={`w-1/2 ${index === 0 ? "mr-2" : "ml-2"}`} key={field}>
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                                                {t(field)}
                                            </label>
                                            <select
                                                className={inputClass(field)}
                                                name={field}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">{t('select_office')}</option>
                                                <option value="1">London</option>
                                                <option value="2">New York</option>
                                                <option value="3">Shanghai</option>
                                                <option value="4">Brisbane</option>
                                                <option value="5">Cape Town</option>
                                            </select>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className={`w-1/2 ${index === 0 ? "mr-2" : "ml-2"}`} key={field}>
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
                                                {t(field)}
                                            </label>
                                            <input
                                                className={inputClass(field)}
                                                name={field}
                                                type="text"
                                                placeholder={t(`${field}_placeholder`)}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    );
                                }
                            })}
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
                            >
                                {/* Dynamically populate these options based on available roles */}
                                <option value="">{t("select_role")}</option>
                                <option value="admin">{t("admin")}</option>
                                <option value="user">{t("user")}</option>
                            </select>
                            </div>
                            <div className="w-1/2 ml-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                {t("type")}
                            </label>
                            <select
                                className={inputClass('type')}
                                name="type"
                                onChange={handleInputChange}
                            >
                                {/* Dynamically populate these options based on types */}
                                <option value="">{t("select_type")}</option>
                                <option value="internal">{t("internal")}</option>
                                <option value="external">{t("external")}</option>
                            </select>
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
                        </div>
                    </div>
                    )}
                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {formType === 'user' ? t('create') : t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );    
}