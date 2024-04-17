import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import loginImg from "../assets/home_img_2.jpg";
import { useIntl } from 'react-intl';
import { useLanguage } from '../LanguageContext';
import { FaGlobeAmericas } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isFadingOut, setIsFadingOut] = useState(false);
    const translations = {
        en: 'My Projects',
        ur: "Мої проекти",
        fr: 'Mes Projets',
        md: "我的项目",
        ar: "مشاريعي",
        es: 'Mis Proyectos',
        de: 'Meine Projekte',
    };
    const [currentTranslation, setCurrentTranslation] = useState(translations.en);
    const [opacityClass, setOpacityClass] = useState('opacity-100'); 
    const { toggleLanguage } = useLanguage(); // Destructure toggleLanguage directly
    const intl = useIntl();
    const t = id => intl.formatMessage({ id });
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleDropdown = () => setShowDropdown(!showDropdown);

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
            }, 1000); // Fade duration
        };

        const intervalId = setInterval(cycleLanguages, 6000); // Change translation every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    const handleLanguageChange = (lang) => {
        toggleLanguage(lang);
        setShowDropdown(false); // Close dropdown after language change
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
                
                // Assuming the response includes the user's photo info
                localStorage.setItem('userPhoto', response.data.photo);
    
                fadeToDashboard();
            } else {
                console.log("Login failed: ", response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };    

    return (
        <div className={`relative w-full h-screen bg-zinc-900/90 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <img className="absolute w-full h-full object-cover mix-blend-overlay" src={loginImg} alt="/" />
            <div className="flex justify-center items-center h-full">
                <form onSubmit={handleLogin} className={`max-w-[400px] w-full mx-auto bg-white p-8 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
                    <div className={`transition-opacity duration-500 ${opacityClass}`}>
                        <h2 className="text-4xl font-bold text-center py-4 text-black">
                            {currentTranslation}
                        </h2>
                    </div>
                    <div className="relative text-right">
                        <FaGlobeAmericas className="text-2xl cursor-pointer absolute right-0" onClick={toggleDropdown} />
                        <AnimatePresence>
                            {showDropdown && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95 },
                                        visible: {
                                            opacity: 1,
                                            scale: 1,
                                            transition: { staggerChildren: 0.3 }
                                        }
                                    }}
                                    className="absolute right-0 mt-10 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                                >
                                    {['en', 'uk'].map((lang, index) => (
                                        <motion.div
                                            key={lang}
                                            variants={{
                                                hidden: { y: -20, opacity: 0 },
                                                visible: {
                                                    y: 0,
                                                    opacity: 1,
                                                    transition: { duration: 0.2 }
                                                }
                                            }}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => { handleLanguageChange(lang); setShowDropdown(false); }}
                                        >
                                            {lang === 'en' ? 'English' : 'Українська'}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-col mb-4 mt-8 relative">
                        <label>{t('username')}</label>
                        <input className="border p-2" type="text" name="username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}/>
                    </div>
                    <div className="flex flex-col relative">
                        <label>{t('password')}</label>
                        <input className="border p-2" type="password" name="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}/>
                    </div>
                    <button className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative">{t('login')}</button>
                    <p className="flex items-center mt-2 relative"><input type="checkbox" className="mr-2"/>{t('rememberMe')}</p>
                </form>
            </div>
        </div>
    );
}