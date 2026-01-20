import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { isAdmin } = useAuth();

    return (
        <aside className="navbar-sidebar">
            <nav>
                <h2>Help Desk</h2>
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/tickets">My tickets</Link>
                    </li>
                    {isAdmin() && (
                        <>
                        <li>
                            <Link to="/admin">Admin Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/admin/tickets">All Tickets</Link>
                        </li>
                        <li>
                            <Link to="/admin/categories">Categories</Link>
                        </li>
                        <li>
                            <Link to="/admin/users">Users</Link>
                        </li>
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
}

export default Navbar;