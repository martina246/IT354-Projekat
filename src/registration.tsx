function Registration() {

    const handleRegistration = () => {
        console.log("handle registration");
    }

    return (
        <div>
            <h1>Registration</h1> <br/>
            <form onSubmit={handleRegistration}>
                <input placeholder="Name" required /> <br/>
                <input placeholder="Last Name" required /> <br/>
                <input type="email" placeholder="Email" required /> <br/>
                <input type="password" placeholder="Password" required /> <br/>

                <button type="submit">Register</button>
            </form>
        
        </div>
        
    )
}

export default Registration;