import React from "react";
import loginImg from "../assets/home_img_2.jpg"

export default function Login() {
    return(
        <div className="relative w-full h-screen bg-zinc-900/90">
            <img className="absolute w-full h-full object-cover mix-blend-overlay" src={loginImg} alt="/" />
            <div className="flex justify-center items-center h-full">
                <form className="max-w-[400px] w-full mx-auto bg-white p-8">
                    <h2 className="text-4xl font-bold text-center py-4">MyProjects</h2>
                    <div>
                        <label>Username</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" />
                    </div>
                    <button>Login</button>
                </form>
            </div>
        </div>
    )
}