// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import '../index.css';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/auth/login', formData)
            .then(response => alert('Login successful!'))
            .catch(error => alert('Login failed'));
    };

    return (
        <div className="container mx-auto mt-8">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="block w-full mb-2 p-2 border rounded"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="block w-full mb-4 p-2 border rounded"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
