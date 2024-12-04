// src/pages/ProfilePage.jsx
import React from 'react';
import '../index.css';

const ProfilePage = ({ user }) => {
    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white p-4 rounded shadow max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Profile</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
