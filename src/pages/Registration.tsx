import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import "./Registration.css";

function Registration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: ''
    })

    const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //zaustavljamo submitovanje podataka
        
        try {

            const newUser = await registerUser(formData);
            console.log('User registered:', newUser);
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            //...formData (spread operator) - kopiraj sve postojece vrednosti iz formData
            [e.target.name]: e.target.value
        });
    };

    return (
        //value + onChange uvek idu zajedno
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Start tracking your support tickets</p>
                <form onSubmit={handleRegistration} className="auth-form">
                    <label className="auth-label" htmlFor="reg-name">Name</label>
                    <input
                        id="reg-name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <label className="auth-label" htmlFor="reg-lastName">Last Name</label>
                    <input
                        id="reg-lastName"
                        name="lastName"
                        placeholder="Your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <label className="auth-label" htmlFor="reg-email">Email</label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <label className="auth-label" htmlFor="reg-password">Password</label>
                    <input
                        id="reg-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />

                    <button type="submit" className="auth-button primary">Register</button>
                </form>
            </div>
        </div>
        
    )
}

export default Registration;