import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { isAdmin, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="navbar-sidebar">
            <nav>
                <div className="navbar-header">
                    <h2>Help Desk</h2>
                </div>
                <ul className="navbar-menu">
                    <li>
                        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tickets" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            My Tickets
                        </NavLink>
                    </li>
                    {isAdmin() && (
                        <>
                        <li className="navbar-divider">
                            <span className="navbar-section-label">Admin</span>
                        </li>
                        <li>
                            <NavLink to="/admin" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/tickets" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                All Tickets
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Categories
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                                Users
                            </NavLink>
                        </li>
                        </>
                    )}
                </ul>
                {user && (
                    <div className="navbar-footer">
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </aside>
    );
}

export default Navbar;