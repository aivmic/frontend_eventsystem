// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axiosInstance from './axiosConfig';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InventoryPage from './pages/InventoryPage';
import ProfilePage from './pages/ProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await axiosInstance.get('/auth/me'); // Adjust endpoint as needed
    //             setUser(response.data);
    //         } catch (error) {
    //             setUser(null);
    //         }
    //     };

    //     fetchUser();
    // }, []);

    const handleLogout = () => {
        Cookies.remove('jwtToken');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <Router>
            <div>
                <Navbar isAuthenticated={!!user} isAdmin={user?.role === 'admin'} />
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route
                        path="/login"
                        element={!user ? <LoginPage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/register"
                        element={!user ? <RegisterPage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/inventory"
                        element={user ? <InventoryPage /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/profile"
                        element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />}
                    />
                    {/* Admin routes can be protected similarly */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
