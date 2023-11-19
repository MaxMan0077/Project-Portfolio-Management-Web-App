import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import loginImg from "../assets/home_img_2.jpg";

export default function Login() {
    const navigate = useNavigate(); // Initialize the useNavigate hook

    // Function to handle login
    const handleLogin = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        navigate('/dashboard'); // Navigate to the dashboard page (or any other page you want)
    }

    return(
        <div className="relative w-full h-screen bg-zinc-900/90">
            <img className="absolute w-full h-full object-cover mix-blend-overlay" src={loginImg} alt="/" />
            <div className="flex justify-center items-center h-full">
                <form onSubmit={handleLogin} className="max-w-[400px] w-full mx-auto bg-white p-8">
                    <h2 className="text-4xl font-bold text-center py-4">MyProjects</h2>
                    <div className="flex flex-col mb-4 relative">
                        <label>Username</label>
                        <input className="border relative bg-gray-100 p-2" type="text" />
                    </div>
                    <div className="flex flex-col relative">
                        <label>Password</label>
                        <input className="border relative bg-gray-100 p-2" type="password" />
                    </div>
                    <button className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative">Login</button>
                    <p className=" flex items-center mt-2 relative"><input className="mr-2" type="checkbox" />Remember Me</p>
                </form>
            </div>
        </div>
    )
}