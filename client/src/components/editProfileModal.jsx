import React, { useState } from 'react';

const UserEditModal = ({ isOpen, onClose, userDetails, updateUserDetails }) => {
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
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />

          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />

          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />

          <label htmlFor="password">New Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

          <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
          <button onClick={onClose} className="mt-4 ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
