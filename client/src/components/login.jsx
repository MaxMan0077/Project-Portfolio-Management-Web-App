import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import loginImg from "../assets/home_img_2.jpg";

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    // Function to update state from input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', credentials);
            
            // Check the response from the server
            if (response.status === 200) {
                console.log("Login successful");
                navigate('/dashboard'); // Navigate on successful login
            } else {
                console.log("Login failed: ", response.data.message);
                // Optionally, handle login failure (e.g., show an error message)
            }
        } catch (error) {
            console.error('Login error:', error);
            // Optionally, handle server error (e.g., show an error message)
        }
    };

    return(
        <div className="relative w-full h-screen bg-zinc-900/90">
            <img className="absolute w-full h-full object-cover mix-blend-overlay" src={loginImg} alt="/" />
            <div className="flex justify-center items-center h-full">
                <form onSubmit={handleLogin} className="max-w-[400px] w-full mx-auto bg-white p-8">
                    <h2 className="text-4xl font-bold text-center py-4">MyProjects</h2>
                    <div className="flex flex-col mb-4 relative">
                        <label>Username</label>
                        <input className="border relative bg-gray-100 p-2" type="text" name="username" value={credentials.username} onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col relative">
                        <label>Password</label>
                        <input className="border relative bg-gray-100 p-2" type="password" name="password" value={credentials.password} onChange={handleChange}/>
                    </div>
                    <button className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative">Login</button>
                    <p className=" flex items-center mt-2 relative"><input className="mr-2" type="checkbox" />Remember Me</p>
                </form>
            </div>
        </div>
    )
}