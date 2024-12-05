// src/components/SuccessModal.jsx
import React from 'react';

const SuccessModal = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow text-center">
                <h2 className="text-2xl font-bold text-green-600">{message}</h2>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
