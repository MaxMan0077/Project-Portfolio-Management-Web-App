import React, { useState, useEffect } from 'react';
import { PhotographIcon } from '@heroicons/react/outline';
import { useIntl } from 'react-intl';

const UserModal = ({ user, onClose, onSave, onDelete }) => {
    const [userData, setUserData] = useState(user || {});
    const { formatMessage } = useIntl();
    const filename = atob(userData.photo);
    const imageUrl = `http://localhost:5001/uploads/${filename}`;
    const [fieldErrors, setFieldErrors] = useState({});

    const t = (id) => formatMessage({ id });

    useEffect(() => {
        setUserData(user);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
        // Also clear errors on change
        if (fieldErrors[name]) {
            const newErrors = { ...fieldErrors };
            delete newErrors[name];
            setFieldErrors(newErrors);
        }
    };

    const validateFields = () => {
        let errors = {};
        if (!userData.name_first || /[^a-zA-Z- ]/.test(userData.name_first)) {
            errors.name_first = "First name is required and must not contain numbers or special characters.";
        }
        if (!userData.name_second || /[^a-zA-Z- ]/.test(userData.name_second)) {
            errors.name_second = "Last name is required and must not contain numbers or special characters.";
        }
        if (!userData.office) errors.office = "Office is required.";
        if (!userData.department) errors.department = "Department is required.";
        if (!userData.user_type) errors.user_type = "User type is required.";
        return errors;
    };

    const handleSaveClick = () => {
        const errors = validateFields();
        setFieldErrors(errors);
        if (Object.keys(errors).length === 0 && userData.iduser) {
            onSave(userData);
        }
    };

    const inputClass = (field) => {
        return `mt-1 block w-full px-3 py-2 bg-white border ${fieldErrors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-center mb-4">
                    {userData.photo ? (
                        <img src={imageUrl} alt="User" className="h-24 w-24 object-cover rounded-full border-2 border-gray-300" />
                    ) : (
                        <PhotographIcon className="h-16 w-16 text-gray-600" />
                    )}
                </div>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">{t('user_details')}</h3>
                    <form className="space-y-3">
                        {['name_first', 'name_second', 'office', 'department', 'user_type'].map((field) => (
                            <div className="space-y-1" key={field}>
                                <label htmlFor={field} className="block text-sm font-bold text-gray-700">
                                    {t(field)}
                                </label>
                                {field === 'office' ? (
                                    <select
                                        className={inputClass(field)}
                                        name={field}
                                        onChange={handleChange}
                                        value={userData[field]}
                                    >
                                        <option value="">{t('select_office')}</option>
                                        <option value="1">London</option>
                                        <option value="2">New York</option>
                                        <option value="3">Shanghai</option>
                                        <option value="4">Brisbane</option>
                                        <option value="5">Cape Town</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name={field}
                                        value={userData[field] || ''}
                                        onChange={handleChange}
                                        className={inputClass(field)}
                                        placeholder={t(`${field}_placeholder`)}
                                    />
                                )}
                                {fieldErrors[field] && <p className="text-red-500 text-xs italic">{fieldErrors[field]}</p>}
                            </div>
                        ))}
                    </form>
                </div>
                <div className="mt-5 sm:mt-6 space-y-3">
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm" onClick={handleSaveClick}>
                        {t('save')}
                    </button>
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm" onClick={() => onDelete(userData.iduser)}>
                        {t('delete')}
                    </button>
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm" onClick={onClose}>
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;