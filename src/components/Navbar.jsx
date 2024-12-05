import React, { useState } from 'react';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { hasRole, clearRoles } from '../services/authService';
import SuccessModal from '../components/SuccessModal';

import axios from 'axios';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For controlling mobile menu
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLogout = async () => {
        try {
            await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });

            setModalMessage('Logout Successful! Redirecting to the main page...');
            setShowSuccessModal(true);
            localStorage.removeItem('accessToken');
            //document.cookie = 'RefreshToken =; expires = Thu, 01 Jan 1970 00:00:00 GMT';

            clearRoles();
            setIsAuthenticated(false);

            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="bg-red-50 text-black p-4 flex justify-between items-center relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold font-roboto text-center">
                <Link to="/" className="mx-auto">EventSystem</Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4 ml-auto">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                ) : (
                    <>
                        {hasRole('EventUser') && (
                            <Link to="/inventory" className="hover:underline">My Events</Link>
                        )}
                        {hasRole('Admin') && <Link to="/admin" className="hover:underline">Admin Panel</Link>}
                        <button className="hover:underline" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

            {/* Mobile Menu Hamburger Icon */}
            <div className="md:hidden flex items-center ml-auto">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-xl">
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-white p-4`}>
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="block py-2 hover:underline">Login</Link>
                        <Link to="/register" className="block py-2 hover:underline">Register</Link>
                    </>
                ) : (
                    <>
                        {hasRole('EventUser') && (
                            <Link to="/inventory" className="block py-2 hover:underline">My Events</Link>
                        )}
                        {hasRole('Admin') && <Link to="/admin" className="block py-2 hover:underline">Admin Panel</Link>}
                        <button className="block py-2 hover:underline" onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    message={modalMessage}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
