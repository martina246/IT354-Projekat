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

            /*//fetch - slanje http zahteva (slanje podataka na backend)
            //http:... - posalji zahtev serveru za rad sa korisnicima '/users' -- endpoint za korisnike
            const response = await fetch('http://localhost:3001/users', {
                //await -- sacekaj da server odgovori pre nego sto nastavis dalje
                method: 'POST',
                //POST-kreiranje novog podatka
                headers: {
                    'Content-type': 'application/json',
                    //ovime govorimo serveru: podaci koje saljem su u JSON formatu
                    //bez ovoga backend cesto ne moze da procita podatke
                }, 
                body: JSON.stringify(formData)
                //ovo je najbitniji deo - http ne moze da salje JS objekte direktno, vec mora pretvoriti u string, taj JSOn se salje serveru u telu zahteva
            });

            //response je odgovor servera koji sadrzi:
            //status(200,404...), podatke koje server vrati, info da li je zahtev uspeo
            if (response.ok) {
            //ovo nam je potrebno jer fetch ne baca gresku ako dobijemo npr 400 ili 500
                const newUser = await response.json();
                //cita telo objekta i pretvara JSON string u javascript objekat
                console.log('User registered:', newUser);

                navigate('/login');
            } else {
                console.error('Registration failed');
            }*/
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