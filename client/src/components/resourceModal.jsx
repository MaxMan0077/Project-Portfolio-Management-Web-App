import React, { useState, useEffect } from 'react';
import { PhotographIcon } from '@heroicons/react/outline';
import { useIntl } from 'react-intl';

const ResourceModal = ({ resource, onClose, onSave, onDelete }) => {
    const [resourceData, setResourceData] = useState(resource || {});
    const { formatMessage } = useIntl();
    const filename = atob(resourceData.photo);
    const imageUrl = `http://localhost:5001/uploads/${filename}`;
    const [fieldErrors, setFieldErrors] = useState({});

    const t = (id) => formatMessage({ id });

    useEffect(() => {
        setResourceData(resource);
    }, [resource]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResourceData(prevState => ({ ...prevState, [name]: value }));
        let errors = validateFields();
        setFieldErrors(errors);
    };      

    const validateFields = () => {
        let errors = {};
        const nameRegex = /^[a-zA-Z- ]*$/;
        if (!resourceData.name_first || !nameRegex.test(resourceData.name_first)) {
            errors.name_first = "First name is required and must not contain numbers or special characters.";
        }
        if (!resourceData.name_second || !nameRegex.test(resourceData.name_second)) {
            errors.name_second = "Last name is required and must not contain numbers or special characters.";
        }
        if (!resourceData.office) errors.office = "Office is required.";
        if (!resourceData.department) errors.department = "Department is required.";
        return errors;
    };

    const handleSaveClick = async () => {
        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        if (!resourceData.idresource) {
            console.error('Resource ID is undefined');
            return;
        }
    
        onSave(resourceData);
    };    

    const inputClass = (field) => `mt-1 block w-full px-3 py-2 bg-white border ${fieldErrors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-10">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="flex justify-center mb-4">
                    {resourceData.photo ? (
                        <img src={imageUrl} alt="Resource" className="h-24 w-24 object-cover rounded-full border-2 border-gray-300" />
                    ) : (
                        <div className="rounded-full bg-gray-300 p-4">
                            <PhotographIcon className="h-16 w-16 text-gray-600" />
                        </div>
                    )}
                </div>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">{t('resource_details')}</h3>
                    <form className="space-y-3">
                        {['name_first', 'name_second', 'name_native', 'office', 'department', 'role', 'type'].map((field) => (
                            <div className="space-y-1" key={field}>
                                <label htmlFor={field} className="block text-sm font-bold text-gray-700">
                                    {t(field)}
                                </label>
                                {field === 'office' ? (
                                    <select
                                        className={inputClass(field)}
                                        name={field}
                                        onChange={handleChange}
                                        value={resourceData[field]}
                                    >
                                        <option value="">{t('select_office')}</option>
                                        <option value="1">London</option>
                                        <option value="2">New York</option>
                                        <option value="3">Shanghai</option>
                                        <option value="4">Brisbane</option>
                                        <option value="5">Cape Town</option>
                                    </select>
                                ) : field === 'department' ? (
                                    <select
                                        className={inputClass(field)}
                                        name={field}
                                        onChange={handleChange}
                                        value={resourceData[field]}
                                    >
                                        <option value="">{t('department')}</option>
                                        <option value="Information Technology">{t('Information Technology')}</option>
                                        <option value="Development">{t('Development')}</option>
                                        <option value="Human Resources">{t('Human Resources')}</option>
                                        <option value="Change Management">{t('Change Management')}</option>
                                        <option value="Front Office">{t('Front Office')}</option>
                                        <option value="Back Office">{t('Back Office')}</option>
                                    </select>
                                ) : field === 'role' ? (
                                    <select
                                        className={inputClass(field)}
                                        name={field}
                                        onChange={handleChange}
                                        value={resourceData[field]}
                                    >
                                        <option value="">{t("select_role")}</option>
                                        <option value="admin">{t("admin")}</option>
                                        <option value="user">{t("user")}</option>
                                    </select>
                                ) : field === 'type' ? (
                                    <select
                                        className={inputClass(field)}
                                        name={field}
                                        onChange={handleChange}
                                        value={resourceData[field]}
                                    >
                                        <option value="">{t("select_type")}</option>
                                        <option value="internal">{t("internal")}</option>
                                        <option value="external">{t("external")}</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name={field}
                                        value={resourceData[field] || ''}
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
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm mt-3" onClick={() => onDelete(resourceData.idresource)}>
                        {t('delete')}
                    </button>
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm mt-3" onClick={onClose}>
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResourceModal;