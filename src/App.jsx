import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/MainPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Inventory from './pages/InventoryPage';
import EditEventPage from './pages/EditEventPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminPage from './pages/AdminPage';


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/inventory" element={<Inventory setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/events/edit/:eventId" element={<EditEventPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/admin" element={<AdminPage setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </Router>
    );
}

export default App;
