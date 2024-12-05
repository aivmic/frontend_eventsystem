import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/MainPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from './pages/ProfilePage';
import Inventory from './pages/InventoryPage';
//import AdminPanel from './pages/AdminPanel';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    // Determine if the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    return (
        <Router>
            {/* Pass isAuthenticated and setIsAuthenticated to Navbar */}
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/inventory" element={<Inventory />} />
                {/* <Route path="/admin" element={<AdminPanel />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
