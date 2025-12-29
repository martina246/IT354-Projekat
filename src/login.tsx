import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();
            //await -- sacekaj da server odgovori pre nego sto nastavis dalje

            const user = users.find((u: any) =>
                u.email === email && u.password === password
            );

            if (user) {
                console.log('Login successful: ', user);
                navigate('/');
            } else {
                alert('Invalid email or password');
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