import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../api/auth.api";
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

            const users = await getAllUsers();
            /*const response = await fetch('http://localhost:3001/users');
            //saljemo GET zahtev json serveru 
            const users = await response.json();
            //dobijamo sve korisnike i pretvaramo ih u json objekat
            //await -- sacekaj da server odgovori pre nego sto nastavis dalje

            //simulacija autentifikacije
            //find prolazi kroz users
            const user = users.find((u: any) =>
                //any korisitmo jer json server nema tipove
                u.email === email && u.password === password
            //u.email-email korisnika iz liste, a samo email-email iz inputa
            //ako ga nadje, user-objekat korisnika, a kone user-undefined
            );*/

            const user = users.find((u) =>
                u.email === email && u.password === password
            );

            const userByEmail = users.find((u) => u.email === email);

            if (!userByEmail) {
                alert('User does not exist');
            } else if (userByEmail.password !== password) {
                alert('Invalid password');
            } else {
                login(user!);
                console.log('Login successful: ', user);
                navigate('/home');
            }
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