// src/components/Navbar.jsx
import React from 'react';
import '../index.css';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, isAdmin }) => {
    return (
        <nav className="bg-red-50 text-black p-4 flex justify-between items-center">
            <div className="text-xl font-bold">
                <Link to="/">EventSystem</Link>
            </div>
            <div className="space-x-4">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/inventory" className="hover:underline">My Events</Link>
                        <Link to="/profile" className="hover:underline">Profile</Link>
                        {isAdmin && <Link to="/admin" className="hover:underline">Admin Panel</Link>}
                        <button className="hover:underline" onClick={() => alert('Logout functionality here')}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
