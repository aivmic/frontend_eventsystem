import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import EventForm from '../components/EventEditForm';

const EditEventPage = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        setCategoryId(urlParams.get('categoryId'));
    }, [location]);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem('accessToken');

        axios.get(`${apiUrl}/categories/${categoryId}/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => setEvent(response.data))
            .catch((err) => console.error('Error fetching event:', err));
    }, [eventId, categoryId]);

    const handleSave = (updatedEvent) => {
        if (!categoryId) {
            console.error('Category ID is missing.');
            return;
        }

        const apiUrl = process.env.REACT_APP_API_URL;
        const token = localStorage.getItem('accessToken');

        axios.put(`${apiUrl}/categories/${categoryId}/events/${updatedEvent.id}`, updatedEvent, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => navigate('/inventory'))
            .catch((err) => console.error('Error saving event:', err));
    };

    const handleCancel = () => {
        navigate('/inventory');
    };

    return (
        <div className="container mx-auto flex justify-center items-center min-h-screen">
            <div className="w-full max-w-lg">
                <h1 className="text-2xl text-center mb-4">Edit Event</h1>
                {event ? (
                    <EventForm event={event} onSave={handleSave} onCancel={handleCancel} />
                ) : (
                    <p className="text-center">Loading...</p>
                )}
            </div>
        </div>
    );
};

export default EditEventPage;
