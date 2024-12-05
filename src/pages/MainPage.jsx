import React, { useState, useEffect } from 'react';
import '../index.css';
// import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import axios from 'axios';

const MainPage = () => {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch events with search term as a query parameter
        const apiUrl = process.env.REACT_APP_API_URL;
        axios.get(`${apiUrl}/events`, { params: { searchTerm } })
            .then((response) => setEvents(response.data))
            .catch((err) => console.error(err));
    }, [searchTerm]); // Refetch data whenever searchTerm changes

    return (
        <div>
            {/* <Navbar isAuthenticated={false} /> */}
            <div className="container mx-auto mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
