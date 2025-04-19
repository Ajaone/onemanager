import React from 'react';

export default function AlertMessage({ message, onClose }) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md mx-auto mt-4 flex items-center justify-center">
      <span className="text-center w-full">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 right-0 mt-2 mr-3 text-yellow-700 hover:text-yellow-900"
      >
        ×
      </button>
    </div>
  );
}
