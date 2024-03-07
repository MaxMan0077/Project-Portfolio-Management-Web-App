import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import loginImg from "../assets/home_img_2.jpg";

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fadeToDashboard = () => {
        setIsFadingOut(true); // Start the fade-out effect
        setTimeout(() => navigate('/dashboard'), 300); // Set the duration of the fade effect
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/users/login', credentials);
            if (response.status === 200) {
                console.log("Login successful");
                fadeToDashboard(); // Use fade function to navigate
            } else {
                console.log("Login failed: ", response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return(
        <div className={`relative w-full h-screen bg-zinc-900/90 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <img className="absolute w-full h-full object-cover mix-blend-overlay" src={loginImg} alt="/" />
            <div className="flex justify-center items-center h-full">
                <form onSubmit={handleLogin} className={`max-w-[400px] w-full mx-auto bg-white p-8 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
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