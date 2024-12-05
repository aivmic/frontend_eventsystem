import React, { useState } from 'react';
import '../index.css';
import axios from 'axios';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ UserName: '', Email: '', Password: '' });
    const [errors, setErrors] = useState([]); // To capture and display errors

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            const response = await axios.post(`${apiUrl}/accounts`, formData);
            alert('Registration successful!');
            setErrors([]); // Clear previous errors on success
        } catch (error) {
            if (error.response && error.response.status === 422 && Array.isArray(error.response.data.errors)) {
                // If backend returns validation errors as an array
                setErrors(error.response.data.errors);
            } else {
                // Handle other cases (e.g., network errors, unexpected errors)
                setErrors(['An unexpected error occurred. Please try again later.']);
            }
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Register</h2>

                {/* Display Errors */}
                {errors.length > 0 && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
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
                    type="email"
                    placeholder="Email"
                    className="block w-full mb-2 p-2 border rounded"
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
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
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
