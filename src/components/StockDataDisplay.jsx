import React from 'react';

export default function StockDataDisplay({ 
    data, 
    error,
    symbol 
}) {
    if (error && !data) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!data) {
        return <p className="text-gray-600">Loading stocks...</p>;
    }

    return (
        <div className="text-center space-y-2">
            <div>
                <p className="text-lg font-semibold">
                    {symbol}: ${data.price.toFixed(2)}
                </p>
                <p className={`text-lg ${data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Change: {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                </p>
            </div>
        </div>
    );
};
