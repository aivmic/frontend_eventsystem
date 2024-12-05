import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AdminPage = (isAuthenticated) => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [deleteType, setDeleteType] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const searchTerm = "";

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;

        //check if user is authenticated
        if (!isAuthenticated) {
            return <Navigate to="/" />;
        }

        const fetchEvents = axios.get(`${apiUrl}/events`, { params: { searchTerm } });

        const fetchCategories = axios.get(`${apiUrl}/categories`);

        Promise.all([fetchEvents, fetchCategories])
            .then(([eventsResponse, categoriesResponse]) => {
                setEvents(eventsResponse.data);
                setCategories(categoriesResponse.data);
            })
            .catch((err) => console.error(err));
    }, [searchTerm]);

    const handleCreateCategory = () => {
        const errors = {};
        if (!newCategoryName || newCategoryName.trim().length < 3 || newCategoryName.trim().length > 50) {
            errors.name = "'Name' must be between 3 and 50 characters.";
        }
        if (!newCategoryDescription || newCategoryDescription.trim().length < 5 || newCategoryDescription.trim().length > 200) {
            errors.description = "'Description' must be between 5 and 200 characters.";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;
        axios.post(`${apiUrl}/categories`, { name: newCategoryName.trim(), description: newCategoryDescription.trim() })
            .then(response => {
                setCategories([...categories, response.data]);
                setNewCategoryName('');
                setNewCategoryDescription('');
                setValidationErrors({});
                setShowCreateCategory(false);
            })
            .catch(err => {
                console.error('Error creating category:', err);
                alert('Error creating category. Please try again.');
            });
    };

    const handleDeleteEventModal = (eventId) => {
        setDeleteItemId(eventId);
        setDeleteType('event');
        setShowDeleteModal(true);
    };

    const handleDeleteCategoryModal = (categoryId) => {
        setDeleteItemId(categoryId);
        setDeleteType('category');
        setShowDeleteModal(true);
    };

    const handleDeleteEvent = () => {
        const apiUrl = process.env.REACT_APP_API_URL;

        axios.delete(`${apiUrl}/categories/${events.find(event => event.id === deleteItemId)?.categoryId}/events/${deleteItemId}`)
            .then(() => {
                setEvents(events.filter(event => event.id !== deleteItemId));
                setDeleteItemId(null);
                setShowDeleteModal(false);
            })
            .catch(err => console.error('Error deleting event:', err));
    };

    const handleDeleteCategory = () => {
        const apiUrl = process.env.REACT_APP_API_URL;

        axios.delete(`${apiUrl}/categories/${deleteItemId}`)
            .then(() => {
                setCategories(categories.filter(category => category.id !== deleteItemId));
                setDeleteItemId(null);
                setShowDeleteModal(false);
                Navigate('/admin');
            })
            .catch(err => console.error('Error deleting category:', err));
    };

    return (
        <div className="admin-page max-w-7xl mx-auto p-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Panel</h1>

            {/* Categories Section */}
            <section className="mb-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Categories</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Category Name</th>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="border px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                                    <td className="border px-6 py-4 text-sm text-gray-700">{category.description}</td>
                                    <td className="border px-6 py-4 text-sm text-gray-500">
                                        <button
                                            onClick={() => handleDeleteCategoryModal(category.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Button to create new category */}
                <div className="mt-4">
                    <button
                        onClick={() => setShowCreateCategory(!showCreateCategory)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        {showCreateCategory ? 'Cancel' : 'Create Category'}
                    </button>
                    {showCreateCategory && (
                        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category Name"
                                className="border p-2 rounded-md w-full mb-3"
                            />
                            {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
                            <input
                                type="text"
                                value={newCategoryDescription}
                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                placeholder="Category Description"
                                className="border p-2 rounded-md w-full"
                            />
                            {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
                            <button
                                onClick={handleCreateCategory}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 transition"
                            >
                                Create
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Events Section */}
            <section>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Events</h2>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
                                <th className="border px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="border px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                                    <td className="border px-6 py-4 text-sm text-gray-700">
                                        {categories.find(cat => cat.id === event.categoryId)?.name || 'Unknown'}
                                    </td>
                                    <td className="border px-6 py-4 text-sm text-gray-700">
                                        {new Date(event.startDate).toLocaleString()}
                                    </td>
                                    <td className="border px-6 py-4 text-sm text-gray-700">
                                        {new Date(event.endDate).toLocaleString()}
                                    </td>
                                    <td className="border px-6 py-4 text-sm text-gray-500">
                                        <button
                                            onClick={() => handleDeleteEventModal(event.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">
                            Are you sure you want to delete this {deleteType}?
                        </h2>
                        <div className="flex justify-between">
                            <button
                                onClick={deleteType === 'event' ? handleDeleteEvent : handleDeleteCategory}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
