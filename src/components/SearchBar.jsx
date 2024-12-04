import React from 'react';
import '../index.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex justify-center">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-2/3 lg:w-1/3"
                placeholder="Search events or categories..."
            />
        </div>
    );
};

export default SearchBar;
