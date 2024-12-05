import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EventCard = ({ event, userId, onEventDeleted }) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/categories/${event.categoryId}/events/${event.id}`);
            onEventDeleted(event.id);
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };

    return (
        <div className="border p-4">
            <h3 className="text-xl">{event.title}</h3>
            <p>{event.description}</p>
            <p>Start Date: {new Date(event.startDate).toLocaleString()}</p>
            <p>End Date: {new Date(event.endDate).toLocaleString()}</p>
            <p>Price: ${event.price}</p>
            <div>
                <Link to={`/events/edit/${event.id}?categoryId=${event.categoryId}`} className="text-blue-500">Edit</Link>
                <button onClick={handleDelete} className="text-red-500 ml-4">Delete</button>
            </div>
        </div>
    );
};

export default EventCard;
