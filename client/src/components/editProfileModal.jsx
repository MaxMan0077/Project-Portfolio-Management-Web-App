import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIntl } from 'react-intl';

const UserEditModal = ({ isOpen, onClose }) => {
    const { formatMessage } = useIntl();
    const t = (id) => formatMessage({ id });
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        profilePic: ''
    });
    const [file, setFile] = useState(null); // State to hold the uploaded file

    useEffect(() => {
        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    const fetchUserData = async () => {
        try {
            const sessionResponse = await axios.get('http://localhost:5001/api/users/session', { withCredentials: true });
            if (sessionResponse.data && sessionResponse.data.sessionData) {
                const userId = sessionResponse.data.sessionData.id;
                const userResponse = await axios.get(`http://localhost:5001/api/users/user/${userId}`, { withCredentials: true });
                if (userResponse.data && userResponse.data.userDetails) {
                    const user = userResponse.data.userDetails;
                    setFormData({
                        username: user.username,
                        firstName: user.nameFirst,
                        lastName: user.nameSecond,
                        password: '',
                        profilePic: user.photo || "https://via.placeholder.com/150"
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const printFormData = (formData) => {
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value instanceof Blob ? `File(${value.name})` : value}`);
      }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const sessionResponse = await axios.get('http://localhost:5001/api/users/session', { withCredentials: true });
        if (sessionResponse.data && sessionResponse.data.sessionData) {
            const userId = sessionResponse.data.sessionData.id;
            const updateFormData = new FormData();  // Create a new FormData object

            // Append form data only if available
            if (formData.firstName) updateFormData.append('name_first', formData.firstName);
            if (formData.lastName) updateFormData.append('name_second', formData.lastName);
            if (formData.username) updateFormData.append('username', formData.username);
            if (formData.password) updateFormData.append('password', formData.password);
            if (file) updateFormData.append('photo', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            };

            const updateResponse = await axios.put(`http://localhost:5001/api/users/updateProfile/${userId}`, updateFormData, config);
            console.log(updateResponse.data.message);
            
            if (file && updateResponse.data.photoUrl) {
                localStorage.setItem('userPhoto', updateResponse.data.photoUrl);
                // Notify other components or force update
                window.dispatchEvent(new Event('storage'));
            }

            alert("Profile updated successfully!");
            onClose(); // Close modal on submit
        } else {
            alert("Session not found. Please log in again.");
        }
    } catch (error) {
        console.error('Failed to update user data:', error);
        alert("Failed to update profile.");
    }
  };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-3xl text-center font-bold mb-10">Account Info</h2>
                <div className="flex flex-col items-center">
                    <img src={formData.profilePic} alt="Profile" className="w-40 h-40 rounded-full object-cover" />
                    <h3 className="text-lg mt-3">{`${formData.firstName} ${formData.lastName}`}</h3>
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4">
                    <div className="my-4">
                        <label htmlFor="firstName" className="block text-lg font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div>
                    <div className="my-4">
                        <label htmlFor="lastName" className="block text-lg font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div>
                    <div className="my-4">
                        <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div>
                    <div className="my-4">
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700">New Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-3 text-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div>
                    <div className="my-4">
                        <label htmlFor="photo" className="block text-lg font-medium text-gray-700">Upload New Photo</label>
                        <input type="file" id="photo" name="photo" onChange={handleFileChange} className="mt-1 p-2 block w-full text-lg border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" />
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-800 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" style={{ textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>
                            {t('cancel')}
                        </button>
                        <button type="submit" className="w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );  
};

export default UserEditModal;