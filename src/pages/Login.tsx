import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../api/auth.api";

function Login() {

    const navigate = useNavigate();
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
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                console.log('Login successful: ', user);
                navigate('/home');
            }
        } catch (error) {
            console.error('Error:', error);
        }

    }

    return (
        <div>
            <h1>Log In</h1> <br/>
            <form onSubmit={handleLogIn}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> <br/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /> <br/>

                <button type="submit">Log In</button>
            </form>
            
        </div>
    )
}

export default Login;