import React from 'react';
import Button from './Button';
import stocksData from '../data/stocks.json';

export default function SelectedStocks({ selectedStocks, onRemoveStock }) {
    const popularStocks = stocksData.stocks;

    if (selectedStocks.length === 0) {
        return (
            <div className="w-full max-w-md">
                <div className="rounded-lg p-4 mb-4">
                    <p className="text-gray-500 text-sm">No stocks selected</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="rounded-lg p-4 mb-4">
                <div className="flex flex-wrap gap-2">
                    {selectedStocks.map(symbol => {
                        const stock = popularStocks.find(s => s.symbol === symbol);
                        return (
                            <Button
                                key={symbol}
                                onClick={() => onRemoveStock(symbol)}
                                variant="default"
                                className="h-8 px-3 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
                            >
                                {symbol} ×
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
