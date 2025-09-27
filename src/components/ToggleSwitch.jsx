import React from 'react';

export default function ToggleSwitch({ viewMode, setViewMode }) {
    return (
        <div className="flex items-center space-x-2">
            <span className={`text-sm ${viewMode === 'individual' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                Individual
            </span>
            <button
                onClick={() => setViewMode(viewMode === 'individual' ? 'portfolio' : 'individual')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${viewMode === 'portfolio' ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${viewMode === 'portfolio' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
            <span className={`text-sm ${viewMode === 'portfolio' ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
                Portfolio
            </span>
        </div>
    );
}