import React, { useEffect, useState } from 'react';
import '../index.css';

const EventCard = ({ event }) => {
    const [categoryName, setCategoryName] = useState(null);

    // Fetch category name by category ID when the component mounts
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                // Assuming the category API endpoint is something like `/api/categories/{id}`
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(`${apiUrl}/categories/${event.categoryId}`);
                if (response.ok) {
                    const categoryData = await response.json();
                    setCategoryName(categoryData.name);  // Set category name state
                } else {
                    console.error('Failed to fetch category');
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        if (event.categoryId) {
            fetchCategory();
        }
    }, [event.categoryId]); // Effect runs when event.categoryId changes

    return (
        <div className="border border-gray-200 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{event.description}</p>
            <p className="text-sm font-medium text-gray-800">
                Date: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm font-medium text-gray-800">Price: ${event.price}</p>
            <p className="text-sm font-medium text-gray-800 mt-2">
                Category: {categoryName ? categoryName : 'Loading...'}
            </p>
            {/* <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                View Details
            </button> */}
        </div>
    );
};

export default EventCard;
