import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import stocksData from '../data/stocks.json';

export default function StockSelector({ selectedStocks, onStocksChange, isSimulating }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    
    const popularStocks = stocksData.stocks;
    
    const filteredStocks = popularStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStockToggle = (stock) => {
        const isSelected = selectedStocks.includes(stock.symbol);
        
        if (isSelected) {
            onStocksChange(selectedStocks.filter(symbol => symbol !== stock.symbol));
        } else {
            if (selectedStocks.length < 5) {
                onStocksChange([...selectedStocks, stock.symbol]);
            } else {
                alert("Maximum 5 stocks allowed for optimal performance");
            }
        }
        
        setIsOpen(false);
        setSearchTerm(''); 
    };

    const removeStock = (symbol) => {
        onStocksChange(selectedStocks.filter(s => s !== symbol));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setSearchTerm(''); 
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isSimulating && isOpen) {
            setIsOpen(false);
        }
    }, [isSimulating, isOpen]);

    return (
        <div className="w-full max-w-md">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Grindset Goldfish</h3>
                
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {selectedStocks.map(symbol => {
                            const stock = popularStocks.find(s => s.symbol === symbol);
                            return (
                                <div key={symbol} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    <span className="mr-2">{symbol}</span>
                                    <button
                                        onClick={() => removeStock(symbol)}
                                        className="text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {selectedStocks.length === 0 && (
                        <p className="text-gray-500 text-sm">No stocks selected</p>
                    )}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <Button
                        onClick={() => setIsOpen(!isOpen)}
                        disabled={isSimulating}
                        className="w-full flex items-center justify-between"
                        variant="default"
                    >
                        <span>Add Stocks</span>
                        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </Button>

                    {isOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                            <div className="p-2 border-b border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search stocks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                            
                            <div className="max-h-48 overflow-y-auto">
                                {filteredStocks.length > 0 ? (
                                    filteredStocks.map(stock => {
                                        const isSelected = selectedStocks.includes(stock.symbol);
                                        return (
                                            <button
                                                key={stock.symbol}
                                                onClick={() => handleStockToggle(stock)}
                                                disabled={!isSelected && selectedStocks.length >= 5}
                                                className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                                                    isSelected ? 'bg-blue-50 text-blue-700' : ''
                                                } ${!isSelected && selectedStocks.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div>
                                                    <span className="font-medium">{stock.symbol}</span>
                                                    <span className="text-gray-500 ml-2">{stock.name}</span>
                                                </div>
                                                {isSelected && (
                                                    <span className="text-blue-600">✓</span>
                                                )}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                        No stocks found matching "{searchTerm}"
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                    {isSimulating 
                        ? "Stock selection disabled during simulation" 
                        : "Select up to 5 stocks. Each fish represents a different stock"
                    }
                </p>
            </div>
        </div>
    );
};
