import React, { useState } from 'react';
import { useIntl } from 'react-intl';

const UserEditModal = ({ isOpen, onClose, userDetails, updateUserDetails }) => {
  const { formatMessage } = useIntl();
  const t = (id) => formatMessage({ id });
  const [formData, setFormData] = useState({
    username: userDetails.username,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserDetails(formData);
    onClose(); // Close modal on submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl"> {/* Increased padding and set maximum width */}
        <h2 className="text-3xl text-center font-bold mb-10">Account Info</h2> {/* Increased font size for the title */}
        <div className="flex flex-col items-center">
          <img
            src={userDetails.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover"
          />
          <h3 className="text-lg mt-3">{`${userDetails.firstName} ${userDetails.lastName}`}</h3> {/* Increased font size for the name */}
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="my-4"> {/* Increased margin for better spacing */}
            <label htmlFor="firstName" className="block text-lg font-medium text-gray-700">First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
  
          <div className="my-4">
            <label htmlFor="lastName" className="block text-lg font-medium text-gray-700">Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
  
          <div className="my-4">
            <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
  
          <div className="my-4">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">New Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
          </div>
  
          <div className="flex justify-end mt-6">
            <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                style={{ textDecoration: 'none' }}
                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
                {t('cancel')}
            </button>
            <button
                type="submit"
                className="w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default UserEditModal;
