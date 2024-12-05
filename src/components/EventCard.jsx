import React, { useEffect, useState } from 'react';
import '../index.css';

const EventCard = ({ event }) => {
    const [categoryName, setCategoryName] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [userHasRated, setUserHasRated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(`${apiUrl}/categories/${event.categoryId}`);
                if (response.ok) {
                    const categoryData = await response.json();
                    setCategoryName(categoryData.name);
                } else {
                    console.error('Failed to fetch category');
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        const fetchRatings = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const response = await fetch(`${apiUrl}/categories/${event.categoryId}/events/${event.id}/ratings`);
                if (response.ok) {
                    const ratings = await response.json();
                    const avgRating = ratings.reduce((acc, rating) => acc + rating.stars, 0) / ratings.length;
                    setAverageRating(avgRating);
                    const userRating = ratings.find(rating => rating.userId === "currentUserId");
                    if (userRating) {
                        setUserRating(userRating);
                        setUserHasRated(true);
                    }
                } else {
                    console.error('Failed to fetch ratings');
                }
            } catch (error) {
                console.error('Error fetching ratings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
        fetchRatings();
    }, [event]);

    const handleRating = async (rating) => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${apiUrl}/categories/${event.categoryId}/events/${event.id}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    stars: rating,
                }),
            });

            if (response.ok) {
                const newRating = await response.json();
                setUserRating(newRating);
                setUserHasRated(true);
                window.location.reload();
            } else {
                alert('Failed to submit rating. Make sure you are logged in');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleUpdateRating = async (rating) => {
        try {
            const token = localStorage.getItem('accessToken');
            const apiUrl = process.env.REACT_APP_API_URL;
            if (userRating) {
                const response = await fetch(`${apiUrl}/categories/${event.categoryId}/events/${event.id}/ratings/${userRating.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        stars: rating,
                    }),
                });

                if (response.ok) {
                    const updatedRating = await response.json();
                    setUserRating(updatedRating);
                    window.location.reload();
                } else {
                    alert('Failed to update rating');
                }
            }
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const renderStars = (count) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`cursor-pointer ${i <= count ? 'text-yellow-500' : 'text-gray-300'} text-2xl`}
                    onClick={() => userHasRated ? handleUpdateRating(i) : handleRating(i)}
                >
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="border border-gray-200 shadow-md rounded-lg p-4">
            {loading ? (
                <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-gray-700 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div> {/* Spinning circle */}
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{event.description}</p>

                    <p className="text-sm font-medium text-gray-800">
                        Date: {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleDateString()} {new Date(event.endDate).toLocaleTimeString()}
                    </p>
                    <p className="text-sm font-medium text-gray-800">Price: ${event.price}</p>
                    <p className="text-sm font-medium text-gray-800 mt-2">
                        Category: {categoryName ? categoryName : 'Loading...'}
                    </p>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-800">Rating: {averageRating.toFixed(1)} / 5</p>
                        <div className="flex items-center">
                            {renderStars(Math.round(averageRating))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EventCard;
