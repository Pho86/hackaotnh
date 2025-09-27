import React, { useRef, useEffect, useState } from 'react';
import stocksData from '../data/stocks.json';

export default function StockGraph({ 
    stocks, 
    isSimulating, 
    currentSimIndex, 
    simulationData,
    width = 800, 
    height = 400 
}) {
    const canvasRef = useRef(null);
    const [points, setPoints] = useState({});
    const [viewMode, setViewMode] = useState('individual');
    const [previousStockSymbols, setPreviousStockSymbols] = useState([]); 
    
    const colors = {};
    stocksData.stocks.forEach(stock => {
        colors[stock.symbol] = stock.color;
    });

    const getStockColor = (symbol) => colors[symbol] || '#666666';

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        
        // vertical grid lines
        for (let i = 0; i <= 10; i++) {
            const x = (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
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
                
                ctx.strokeStyle = '#9CA3AF';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                
                for (let i = 0; i <= 4; i++) {
                    const value = minValue - valuePadding + ((valueRange + 2 * valuePadding) / 4) * i;
                    const y = height - (i / 4) * height;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                    
                    ctx.fillStyle = '#6B7280';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(`$${value.toFixed(2)}`, 5, y - 5);
                }
                ctx.setLineDash([]);
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
                        const x = (index / (portfolioPoints.length - 1)) * width;
                        const normalizedValue = (point.totalValue - minValue + valuePadding) / (valueRange + 2 * valuePadding);
                        const y = height - (normalizedValue * height);
                        
                        if (index === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });
                    ctx.stroke();
                    
                    ctx.fillStyle = '#8B5CF6';
                    portfolioPoints.forEach((point, index) => {
                        const x = (index / (portfolioPoints.length - 1)) * width;
                        const normalizedValue = (point.totalValue - minValue + valuePadding) / (valueRange + 2 * valuePadding);
                        const y = height - (normalizedValue * height);
                        
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, 2 * Math.PI);
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
                
                let isInPrediction = false;
                stockPoints.forEach((point, index) => {
                    const x = (index / (stockPoints.length - 1)) * width;
                    const normalizedPrice = (point.price - minPrice + pricePadding) / (priceRange + 2 * pricePadding);
                    const y = height - (normalizedPrice * height);
                    
                    // Switch to dashed line when entering prediction mode
                    if (point.isPrediction && !isInPrediction) {
                        ctx.stroke();
                        ctx.setLineDash([8, 4]);
                        ctx.strokeStyle = color + '80'; // Add transparency
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        isInPrediction = true;
                    } else if (!point.isPrediction && isInPrediction) {
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.strokeStyle = color;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        isInPrediction = false;
                    } else if (index === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.stroke();

                stockPoints.forEach((point, index) => {
                    const x = (index / (stockPoints.length - 1)) * width;
                    const normalizedPrice = (point.price - minPrice + pricePadding) / (priceRange + 2 * pricePadding);
                    const y = height - (normalizedPrice * height);
                    
                    if (point.isPrediction) {
                        // hollow circles for predictions
                        ctx.strokeStyle = color + '80';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, 2 * Math.PI);
                        ctx.stroke();
                    } else {
                        // filled circles for historical data
                        ctx.fillStyle = color;
                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                });
            });
        }

    }, [points, width, height, viewMode]);

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
        <div className="bg-white border h-max border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Stock Performance Graph</h3>
            </div>
            
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="border border-gray-300 rounded"
            />
            
            <div className="flex flex-wrap gap-4 mt-4">
                {viewMode === 'individual' ? (
                    Object.keys(points).map(symbol => (
                        <div key={symbol} className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: getStockColor(symbol) }}
                            />
                            <span className="text-sm font-medium">{symbol}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-600" />
                        <span className="text-sm font-medium">Total Portfolio Value</span>
                    </div>
                )}
            </div>
            
            {!isSimulating && Object.keys(points).length === 0 && (
                <p className="text-gray-500 text-sm text-center">
                    Start the simulation to see the graph
                </p>
            )}
        </div>
    );
}
