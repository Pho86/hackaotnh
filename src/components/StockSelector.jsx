import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";
import stocksData from "../data/stocks.json";

export default function StockSelector({
  selectedStocks,
  onStocksChange,
  isSimulating,
  onRemoveStock,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const popularStocks = stocksData.stocks;

  const filteredStocks = popularStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockToggle = (stock) => {
    const isSelected = selectedStocks.includes(stock.symbol);

    if (isSelected) {
      onStocksChange(
        selectedStocks.filter((symbol) => symbol !== stock.symbol)
      );
    } else {
      if (selectedStocks.length < 5) {
        onStocksChange([...selectedStocks, stock.symbol]);
      } else {
        alert("Maximum 5 stocks allowed for optimal performance");
      }
    }

    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isSimulating && isOpen) {
      setIsOpen(false);
    }
  }, [isSimulating, isOpen]);

    return (
      <div className="pl-4 w-full max-w-md">
        <div className="flex flex-row gap-4">
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              disabled={isSimulating}
              className="flex items-center justify-between whitespace-nowrap"
              variant="default"
            >
              <span>Add Stocks</span>
              <svg
                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>

            {isOpen && (
              <div className="absolute w-80 mt-1 bg-black/70 border border-neutral-700 rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
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
                    filteredStocks.map((stock) => {
                      const isSelected = selectedStocks.includes(stock.symbol);
                      return (
                        <button
                          key={stock.symbol}
                          onClick={() => handleStockToggle(stock)}
                          disabled={!isSelected && selectedStocks.length >= 5}
                          className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-blue-700 flex items-center justify-between ${
                            isSelected ? "bg-blue-800 text-blue-200" : ""
                          } ${
                            !isSelected && selectedStocks.length >= 5
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div>
                            <span className="font-medium">{stock.symbol}</span>
                            <span className="text-gray-500 ml-2">{stock.name}</span>
                          </div>
                          {isSelected && <span className="text-blue-600">✓</span>}
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
          {/* Selected stocks display */}
          <div className="flex flex-row gap-4 items-center text-black">
            <p>selected:</p>
            {selectedStocks.map((symbol) => {
              const stock = popularStocks.find((s) => s.symbol === symbol);
              const stockColor = stock?.color || '#666666';
              return (
                <div
                  key={symbol}
                  className="flex items-center px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: stockColor }}
                >
                  <span className="mr-2">{symbol}</span>
                  <button
                    onClick={() => onRemoveStock(symbol)}
                    className="text-white hover:text-gray-200 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

}