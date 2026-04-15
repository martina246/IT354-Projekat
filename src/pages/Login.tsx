import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
        //funkcija se poziva kada se forma submituje
        //e je event objekat, koji dolazi iz HTMLFormElement
        e.preventDefault();
        
        try {

            const user = await loginUser({email, password});

            login(user);
            
            navigate('/home');

        } catch (error) {
            console.error('Error:', error);
        }

    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Log In</h1>
                <p className="auth-subtitle">Access your help desk dashboard</p>
                <form onSubmit={handleLogIn} className="auth-form">
                    <label className="auth-label" htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <label className="auth-label" htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />

                    <button type="submit" className="auth-button primary">Log In</button>
                </form>
            </div>
        </div>
    )
}

export default Login;