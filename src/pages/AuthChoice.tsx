import { useNavigate } from "react-router-dom";
import "./AuthChoice.css";

function FirstPage() {
    const navigate = useNavigate();

    const handleLogInClick = () => {
        navigate('/login');
    };

    const handleSignUpClick = () => {
        navigate('/registration');
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Help Desk</h1>
                <p className="auth-subtitle">Choose how you want to continue</p>
                <div className="auth-actions">
                    <button onClick={handleLogInClick} className="auth-button primary">
                        Log In
                    </button>
                    <button onClick={handleSignUpClick} className="auth-button secondary">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FirstPage;