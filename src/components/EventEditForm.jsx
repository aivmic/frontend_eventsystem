import React, { useState, useEffect } from 'react';

const EventForm = ({ event, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
        }
    }, [event]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const eventData = { title, description };
        if (event) {
            eventData.id = event.id;
        }
        onSave(eventData);
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-lg">
            <h1 className="text-4xl font-semibold mb-6">{event.title}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Event Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                {/* Description Textarea */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 mt-6">
                    <button
                        type="submit"
                        className=" w-full items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"

                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded ml-4 hover:bg-red-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
