import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Tickets() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <aside>
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
            </div>


            <main style={{ flex: 1, padding: '2rem' }}>
                
            </main>
        </div>
    )
}

export default Tickets;