import { useNavigate } from "react-router-dom";

function FirstPage() {
    const navigate = useNavigate();

    const handleLogInClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/registration');
    };

    return (
        <div>
            <h1>First Page</h1>
            <button onClick={handleLogInClick}>Log In</button> <br />
            <button onClick={handleSignUpClick}>Sign Up</button>
        </div>
    )
}

export default FirstPage;