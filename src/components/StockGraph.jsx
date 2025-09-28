import React, { useRef, useEffect, useState } from 'react';
import stocksData from '../data/stocks.json';

export default function StockGraph({ 
    stocks, 
    isSimulating, 
    currentSimIndex, 
    simulationData,
    viewMode = 'individual',
    width, 
    height 
}) {
    const canvasRef = useRef(null);
    const [points, setPoints] = useState({});
    const [previousStockSymbols, setPreviousStockSymbols] = useState([]);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 }); 
    
    const colors = {};
    stocksData.stocks.forEach(stock => {
        colors[stock.symbol] = stock.color;
    });

    const getStockColor = (symbol) => colors[symbol] || '#666666';

    // Handle responsive sizing
    useEffect(() => {
        const updateDimensions = () => {
            const screenWidth = window.innerWidth;
            let newWidth, newHeight;

            if (screenWidth < 640) { // Mobile
                newWidth = Math.min(screenWidth - 32, 350); // 32px padding
                newHeight = 250;
            } else if (screenWidth < 768) { // Small tablet
                newWidth = Math.min(screenWidth - 64, 500);
                newHeight = 300;
            } else if (screenWidth < 1024) { // Tablet
                newWidth = Math.min(screenWidth - 96, 650);
                newHeight = 350;
            } else { // Desktop
                newWidth = width || 800;
                newHeight = height || 400;
            }

            setDimensions({ width: newWidth, height: newHeight });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        
        return () => window.removeEventListener('resize', updateDimensions);
    }, [width, height]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        
        // vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (dimensions.width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, dimensions.height);
            ctx.stroke();
        }
        
        // horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (dimensions.height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(dimensions.width, y);
            ctx.stroke();
        }

        if (Object.keys(points).length > 0) {
            let minValue = Infinity;
            let maxValue = -Infinity;
            
            if (viewMode === 'portfolio') {
                // calculate portfolio values for scaling
                const stockSymbols = Object.keys(points);
                if (stockSymbols.length > 0 && points[stockSymbols[0]].length > 0) {
                    const maxLength = Math.max(...stockSymbols.map(symbol => points[symbol].length));
                    
                    for (let i = 0; i < maxLength; i++) {
                        let totalValue = 0;
                        let hasData = false;
                        
                        stockSymbols.forEach(symbol => {
                            if (points[symbol][i]) {
                                totalValue += points[symbol][i].price;
                                hasData = true;
                            }
                        });
                        
                        if (hasData) {
                            minValue = Math.min(minValue, totalValue);
                            maxValue = Math.max(maxValue, totalValue);
                        }
                    }
                }
            } else {
                // individual stock mode
                Object.values(points).forEach(stockPoints => {
                    stockPoints.forEach(point => {
                        if (point.price) {
                            minValue = Math.min(minValue, point.price);
                            maxValue = Math.max(maxValue, point.price);
                        }
                    });
                });
            }

            if (minValue !== Infinity) {
                const valueRange = maxValue - minValue;
                const valuePadding = valueRange * 0.1;
                
                ctx.strokeStyle = '#4B5563';
                ctx.lineWidth = 1;
                
                for (let i = 0; i <= 4; i++) {
                    const value = minValue - valuePadding + ((valueRange + 2 * valuePadding) / 4) * i;
                    const y = dimensions.height - (i / 4) * dimensions.height;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(dimensions.width, y);
                    ctx.stroke();
                    
                    ctx.fillStyle = '#D1D5DB';
                    ctx.font = dimensions.width < 500 ? '10px Arial' : '12px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(`$${value.toFixed(2)}`, 5, y - 5);
                }
            }
        }

        if (viewMode === 'portfolio') {
            const portfolioPoints = [];
            const stockSymbols = Object.keys(points);
            
            if (stockSymbols.length > 0 && points[stockSymbols[0]].length > 0) {
                const maxLength = Math.max(...stockSymbols.map(symbol => points[symbol].length));
                
                for (let i = 0; i < maxLength; i++) {
                    let totalValue = 0;
                    let hasData = false;
                    
                    stockSymbols.forEach(symbol => {
                        if (points[symbol][i]) {
                            totalValue += points[symbol][i].price;
                            hasData = true;
                        }
                    });
                    
                    if (hasData) {
                        portfolioPoints.push({
                            totalValue: totalValue, 
                            index: i
                        });
                    }
                }
                
                if (portfolioPoints.length > 1) {
                    // find min and max for portfolio
                    const values = portfolioPoints.map(p => p.totalValue);
                    const minValue = Math.min(...values);
                    const maxValue = Math.max(...values);
                    const valueRange = maxValue - minValue;
                    const valuePadding = valueRange * 0.1;
                    
                    // draw portfolio line
                    ctx.strokeStyle = '#8B5CF6'; 
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    
                    portfolioPoints.forEach((point, index) => {
                        const x = (index / (portfolioPoints.length - 1)) * dimensions.width;
                        const normalizedValue = (point.totalValue - minValue + valuePadding) / (valueRange + 2 * valuePadding);
                        const y = dimensions.height - (normalizedValue * dimensions.height);
                        
                        if (index === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });
                    ctx.stroke();
                    
                    ctx.fillStyle = '#8B5CF6';
                    portfolioPoints.forEach((point, index) => {
                        const x = (index / (portfolioPoints.length - 1)) * dimensions.width;
                        const normalizedValue = (point.totalValue - minValue + valuePadding) / (valueRange + 2 * valuePadding);
                        const y = dimensions.height - (normalizedValue * dimensions.height);
                        
                        ctx.beginPath();
                        ctx.arc(x, y, dimensions.width < 500 ? 3 : 5, 0, 2 * Math.PI);
                        ctx.fill();
                    });
                }
            }
        } else {
            let minPrice = Infinity;
            let maxPrice = -Infinity;
            
            Object.values(points).forEach(stockPoints => {
                stockPoints.forEach(point => {
                    if (point.price) {
                        minPrice = Math.min(minPrice, point.price);
                        maxPrice = Math.max(maxPrice, point.price);
                    }
                });
            });

            if (minPrice === Infinity) {
                minPrice = 0;
                maxPrice = 1000;
            }

            const priceRange = maxPrice - minPrice;
            const pricePadding = priceRange * 0.1;

            Object.keys(points).forEach(symbol => {
                const stockPoints = points[symbol];
                if (stockPoints.length < 2) return;

                const color = getStockColor(symbol);
                
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                stockPoints.forEach((point, index) => {
                    const x = (index / (stockPoints.length - 1)) * dimensions.width;
                    const normalizedPrice = (point.price - minPrice + pricePadding) / (priceRange + 2 * pricePadding);
                    const y = dimensions.height - (normalizedPrice * dimensions.height);
                    
                    if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.stroke();

                stockPoints.forEach((point, index) => {
                    const x = (index / (stockPoints.length - 1)) * dimensions.width;
                    const normalizedPrice = (point.price - minPrice + pricePadding) / (priceRange + 2 * pricePadding);
                    const y = dimensions.height - (normalizedPrice * dimensions.height);
                    
                    // filled circles for all data points
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, dimensions.width < 500 ? 3 : 4, 0, 2 * Math.PI);
                    ctx.fill();
                });
            });
        }

    }, [points, dimensions, viewMode, isSimulating]);

    useEffect(() => {
        if (!isSimulating || !simulationData) return;

        setPoints(prevPoints => {
            const newPoints = { ...prevPoints };
            
            Object.keys(simulationData).forEach(symbol => {
                if (!newPoints[symbol]) {
                    newPoints[symbol] = [];
                }
                
                // add current data point if we have data for this index
                if (simulationData[symbol] && simulationData[symbol][currentSimIndex]) {
                    const currentData = simulationData[symbol][currentSimIndex];
                    const prevData = simulationData[symbol][currentSimIndex - 1];
                    
                    // calculate change percent if we have previous data
                    let changePercent = 0;
                    if (prevData) {
                        changePercent = ((currentData.price - prevData.price) / prevData.price) * 100;
                    }
                    
                    newPoints[symbol].push({
                        ...currentData,
                        changePercent
                    });
                }
            });
            
            return newPoints;
        });
    }, [currentSimIndex, simulationData, isSimulating]);

    // clear points when a new simulation starts
    useEffect(() => {
        if (isSimulating && currentSimIndex === 0) {
            setPoints({});
        }
    }, [isSimulating, currentSimIndex]);

    // clear points when stock selection changes
    useEffect(() => {
        const currentSymbols = Object.keys(stocks).sort();
        const previousSymbols = previousStockSymbols.sort();
        
        if (JSON.stringify(currentSymbols) !== JSON.stringify(previousSymbols)) {
            setPoints({});
            setPreviousStockSymbols(currentSymbols);
        }
    }, [stocks, previousStockSymbols]);

    return (
        <div className="bg-black/30 z-100 rounded-lg p-2 sm:p-4 shadow-lg w-full max-w-[600px] overflow-x-auto">
            <div className="flex justify-between items-center mb-2 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-white">Stock Performance Graph</h3>
            </div>
            
            <div className="flex justify-center">
                <canvas
                    ref={canvasRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="border border-gray-600 rounded max-w-full"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4 justify-center">
                {viewMode === 'individual' ? (
                    Object.keys(points).map(symbol => (
                        <div key={symbol} className="flex items-center gap-1 sm:gap-2">
                            <div 
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                                style={{ backgroundColor: getStockColor(symbol) }}
                            />
                            <span className="text-xs sm:text-sm font-medium text-white">{symbol}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-400" />
                        <span className="text-xs sm:text-sm font-medium text-white">Cumulative</span>
                    </div>
                )}
            </div>
        </div>
    );
}
