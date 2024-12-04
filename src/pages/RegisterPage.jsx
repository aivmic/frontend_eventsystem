// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import '../index.css';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('api/accounts', formData)
            .then(response => alert('Registration successful!'))
            .catch(error => alert('Registration failed'));
    };

    return (
        <div className="container mx-auto mt-8">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                    type="text"
                    placeholder="Name"
                    className="block w-full mb-2 p-2 border rounded"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
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
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
