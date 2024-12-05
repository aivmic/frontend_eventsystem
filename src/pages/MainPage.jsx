import React, { useState, useEffect } from 'react';
import '../index.css';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import axios from 'axios';

const MainPage = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL;
        axios.get(`${apiUrl}/events`, { params: { searchTerm } })
            .then((response) => setEvents(response.data))
            .catch((err) => console.error(err));
    }, [searchTerm]);

    return (
        <div>
            <div className="container mx-auto mt-16 px-4 sm:px-6 lg:px-8">
                {/* Search Bar */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {/* No events found message */}
                {events.length === 0 ? (
                    <div className="flex mt-40 justify-center items-center h-64">
                        <div className="text-center">
                            <p className="text-xl text-gray-500 mb-4">No events found</p>
                            <img
                                src="https://i.postimg.cc/4dMG89YJ/artworks-Mx-VGG0-Ea-Rhx-NS0e-C-Ync-Zsg-t500x500.jpg" // Pakeiskite su savo paveikslėliu
                                alt="No events"
                                className="max-w-full h-auto mx-auto" // responsyvus paveikslėlis
                            />
                        </div>
                    </div>
                ) : (
                    // Grid layout for events
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainPage;
