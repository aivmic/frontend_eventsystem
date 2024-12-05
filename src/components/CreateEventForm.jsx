import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateEventForm = ({ onCreateEvent, onGoBack }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [price, setPrice] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;

        axios.get(`${apiUrl}/categories`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        // Title Validation
        if (!title.trim()) {
            formErrors.title = 'Event title is required';
            isValid = false;
        } else if (title.length < 5 || title.length > 100) {
            formErrors.title = 'Title must be between 5 and 100 characters';
            isValid = false;
        }

        // Description Validation
        if (!description.trim()) {
            formErrors.description = 'Description is required';
            isValid = false;
        } else if (description.length < 10) {
            formErrors.description = 'Description must be at least 10 characters';
            isValid = false;
        }

        // Start Date Validation
        if (!startDate) {
            formErrors.startDate = 'Start date is required';
            isValid = false;
        } else if (new Date(startDate) < new Date()) {
            formErrors.startDate = 'Start date must be in the future';
            isValid = false;
        }

        // End Date Validation
        if (!endDate) {
            formErrors.endDate = 'End date is required';
            isValid = false;
        } else if (new Date(endDate) <= new Date(startDate)) {
            formErrors.endDate = 'End date must be after the start date';
            isValid = false;
        }

        // Price Validation
        if (price && price <= 0) {
            formErrors.price = 'Price must be a positive number';
            isValid = false;
        }


        // Category Validation
        if (!selectedCategory) {
            formErrors.selectedCategory = 'Please select a category';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newEvent = { title, description, startDate, endDate, price };

        const apiUrl = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem('accessToken');

        axios.post(`${apiUrl}/categories/${selectedCategory}/events`, newEvent, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                onCreateEvent(response.data);
            })
            .catch((err) => console.error('Error creating event:', err));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="4"
                    />
                    {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                </div>

                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate}</span>}
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate}</span>}
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.selectedCategory && <span className="text-red-500 text-sm">{errors.selectedCategory}</span>}
                </div>

                <div className="flex justify-between space-x-4 mt-6">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                    >
                        Save Event
                    </button>
                    <button
                        type="button"
                        onClick={onGoBack}
                        className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300"
                    >
                        Go Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEventForm;
