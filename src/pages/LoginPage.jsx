// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal'; // Import the SuccessModal component
import { login, setupAxiosInterceptors } from '../services/authService'; // Import the service

const LoginPage = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({ UserName: '', Password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Set up Axios interceptors when the component mounts
        setupAxiosInterceptors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            await login(formData.UserName, formData.Password);

            // Show success modal with a custom message
            setModalMessage('Login Successful! Redirecting to the main page...');
            setShowSuccessModal(true);
            setIsAuthenticated(true);

            // Redirect to main page after a short delay
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/');
            }, 1500);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Login</h2>

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMessage}</div>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    className="block w-full mb-2 p-2 border rounded"
                    value={formData.UserName}
                    onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="block w-full mb-4 p-2 border rounded"
                    value={formData.Password}
                    onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Login
                </button>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    message={modalMessage}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
        </div>
    );
};

export default LoginPage;
