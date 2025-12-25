function Login() {

    const handleLogIn = () => {
        console.log("handle log in");
    }

    return (
        <div>
            <h1>Log In</h1> <br/>
            <form onSubmit={handleLogIn}>
                <input type="email" placeholder="Email" required /> <br/>
                <input type="password" placeholder="Password" required /> <br/>

                <button type="submit">Log In</button>
            </form>
            
        </div>
    )
}

export default Login;