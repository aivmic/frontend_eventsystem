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
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleLogout = async () => {
        try {
            // Send a request to the backend to logout (clear refresh token)
            await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });

            setModalMessage('Logout Successful! Redirecting to the main page...');
            setShowSuccessModal(true);
            // Clear the local storage
            localStorage.removeItem('accessToken');
            clearRoles();
            setIsAuthenticated(false);

            // Redirect the user to the login page

            // Redirect to main page after a short delay
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/');
            }, 2000);

            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                        {hasRole('EventUser') && (
                            <>
                                <Link to="/inventory" className="hover:underline">My Events</Link>
                                <Link to="/profile" className="hover:underline">Profile</Link>
                            </>
                        )}
                        {hasRole('Admin') && <Link to="/admin" className="hover:underline">Admin Panel</Link>}
                        <button className="hover:underline" onClick={handleLogout}>Logout</button>
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
