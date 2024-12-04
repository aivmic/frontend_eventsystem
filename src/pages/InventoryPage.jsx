// src/pages/InventoryPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import '../index.css';
import axios from 'axios';

const InventoryPage = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('/api/events/mine')
            .then(response => setEvents(response.data))
            .catch(err => console.error(err));
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* <Navbar isAuthenticated={true} /> */}
            <div className="container mx-auto mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="p-4 bg-gray-100 rounded shadow">
                            <h3 className="text-lg font-bold">{event.title}</h3>
                            <p>{event.description}</p>
                            <button className="bg-red-500 text-white mt-2 px-4 py-1 rounded">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
