import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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
                </ul>
            </nav>
        </aside>
    );
}

export default Navbar;