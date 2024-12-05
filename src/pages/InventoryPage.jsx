import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventInventoryCard';
import CreateEventForm from '../components/CreateEventForm';
import { Navigate } from 'react-router-dom';

const InventoryPage = (isAuthenticated) => {
    const [events, setEvents] = useState([]);
    const [userId, setUserId] = useState('');
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);

    useEffect(() => {
        //check if user is authenticated
        if (!isAuthenticated) {
            return <Navigate to="/" />;
        }

        const apiUrl = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem('accessToken');

        axios.get(`${apiUrl}/events/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setEvents(response.data);
            })
            .catch((err) => console.error('Error fetching events:', err));

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.sub);
    }, []);

    const handleEventDeleted = (eventId) => {
        setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
    };

    const handleCreateEvent = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setShowCreateEventForm(false);
    };

    const handleGoBack = () => {
        setShowCreateEventForm(false);
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">My Events</h1>
            {!showCreateEventForm ? (
                <>
                    <button
                        onClick={() => setShowCreateEventForm(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create New Event
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {events.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                userId={userId}
                                onEventDeleted={handleEventDeleted}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <CreateEventForm
                    onCreateEvent={handleCreateEvent}
                    onGoBack={handleGoBack}
                />
            )}
        </div>
    );
};

export default InventoryPage;
