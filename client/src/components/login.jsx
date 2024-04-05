import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import loginImg from "../assets/home_img_2.jpg";
import { useIntl } from 'react-intl';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isFadingOut, setIsFadingOut] = useState(false);
    const translations = {
        en: 'My Projects',
        fr: 'Mes Projets',
        es: 'Mis Proyectos',
        de: 'Meine Projekte',
    };
    const [currentTranslation, setCurrentTranslation] = useState(translations.en);
    const [opacityClass, setOpacityClass] = useState('opacity-100');

    useEffect(() => {
        let currentLangs = Object.keys(translations);
        let currentIndex = 0;

        const cycleLanguages = () => {
            // Fade out
            setOpacityClass('opacity-0');
            
            setTimeout(() => {
                // Change language after fade out
                currentIndex = (currentIndex + 1) % currentLangs.length;
                setCurrentTranslation(translations[currentLangs[currentIndex]]);

                // Fade in with new translation
                setOpacityClass('opacity-100');
            }, 2000); // Fade duration
        };

        const intervalId = setInterval(cycleLanguages, 6000); // Change translation every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const fadeToDashboard = () => {
        setIsFadingOut(true);
        setTimeout(() => navigate('/dashboard'), 300);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/users/login', credentials);
            if (response.status === 200) {
                console.log("Login successful");
                fadeToDashboard();
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
                    <div className={`transition-opacity duration-500 ${opacityClass}`}>
                        <h2 className="text-4xl font-bold text-center py-4 text-black">
                            {currentTranslation}
                        </h2>
                    </div>
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