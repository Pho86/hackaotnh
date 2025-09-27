import React, { useState, useEffect } from 'react';
import fakeStockApiService from '../services/fakeStockApi';
import PetDisplay from './PetDisplay';
import StockDataDisplay from './StockDataDisplay';
import SimulationControls from './SimulationControls';
import StockSelector from './StockSelector';

export default function PetManager({ symbols = ["AAPL"] }) {
    const [selectedSymbols, setSelectedSymbols] = useState(symbols);
    const [pets, setPets] = useState({});
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationData, setSimulationData] = useState({});
    const [currentSimIndex, setCurrentSimIndex] = useState(0);
    const [simulationSpeed, setSimulationSpeed] = useState(1000);
    const [error, setError] = useState(null);
    const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);

    useEffect(() => {
        const initialPets = {};
        selectedSymbols.forEach(symbol => {
            initialPets[symbol] = {
                data: null,
                mood: "neutral",
                historicalData: []
            };
        });
        setPets(initialPets);
    }, [selectedSymbols]);

    const updateMood = (changePercent) => {
        if (changePercent > 1) return "happy";
        if (changePercent < -1) return "sad";
        return "neutral";
    };

    const fetchAllRealTimeData = async () => {
        if (isSimulating) return;

        try {
            setError(null);
            const { results, errors } = await fakeStockApiService.fetchMultipleSymbols(selectedSymbols);
            
            setPets(prevPets => {
                const updatedPets = { ...prevPets };
                
                results.forEach(result => {
                    updatedPets[result.symbol] = {
                        ...updatedPets[result.symbol],
                        data: result,
                        mood: updateMood(result.changePercent)
                    };
                });

                return updatedPets;
            });

            if (errors.length > 0) {
                console.warn("Some API calls failed:", errors);
            }
        } catch (err) {
            console.error("Error fetching real-time data:", err);
            setError(`Failed to fetch stock data: ${err.message}`);
        }
    };

    const fetchAllHistoricalData = async () => {
        if (selectedSymbols.length === 0) return;
        
        try {
            setError(null);
            setIsLoadingHistorical(true);

            const { results, errors } = await fakeStockApiService.fetchMultipleHistoricalData(
                selectedSymbols, 
                100, 
            );

            setSimulationData(results);

            setPets(prevPets => {
                const updatedPets = { ...prevPets };
                selectedSymbols.forEach(symbol => {
                    if (results[symbol]) {
                        updatedPets[symbol] = {
                            ...updatedPets[symbol],
                            historicalData: results[symbol]
                        };
                    }
                });
                return updatedPets;
            });

            if (Object.keys(errors).length > 0) {
                const errorSymbols = Object.keys(errors);
                setError(`Failed to fetch data for: ${errorSymbols.join(', ')}`);
            }

        } catch (err) {
            console.error("Error fetching historical data:", err);
            setError(`Failed to fetch historical data: ${err.message}`);
        } finally {
            setIsLoadingHistorical(false);
        }
    };

    useEffect(() => {
        if (isSimulating || Object.keys(pets).length === 0) return;

        fetchAllRealTimeData();

        const interval = setInterval(fetchAllRealTimeData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, [isSimulating, selectedSymbols]);

    useEffect(() => {
        if (Object.keys(pets).length > 0) {
            fetchAllHistoricalData();
        }
    }, [Object.keys(pets).length]);

    useEffect(() => {
        if (!isSimulating || Object.keys(simulationData).length === 0) return;

        const interval = setInterval(() => {
            setCurrentSimIndex(prev => {
                const allSymbolsHaveData = selectedSymbols.every(symbol => 
                    simulationData[symbol] && simulationData[symbol].length > 0
                );

                if (!allSymbolsHaveData) return prev;

                const maxLength = Math.max(...selectedSymbols.map(symbol => simulationData[symbol].length));
                const nextIndex = prev + 1;

                if (nextIndex >= maxLength) {
                    setIsSimulating(false); 
                    return prev;
                }

                setPets(prevPets => {
                    const updatedPets = { ...prevPets };
                    
                    selectedSymbols.forEach(symbol => {
                        if (simulationData[symbol] && simulationData[symbol][nextIndex]) {
                            const currentData = simulationData[symbol][nextIndex];
                            const prevData = simulationData[symbol][prev] || currentData;
                            
                            const changePercent = prevData ? 
                                ((currentData.price - prevData.price) / prevData.price) * 100 : 0;

                            updatedPets[symbol] = {
                                ...updatedPets[symbol],
                                data: {
                                    ...currentData,
                                    changePercent
                                },
                                mood: updateMood(changePercent)
                            };
                        }
                    });

                    return updatedPets;
                });

                return nextIndex;
            });
        }, simulationSpeed);

        return () => clearInterval(interval);
    }, [isSimulating, simulationData, simulationSpeed, selectedSymbols]);

    const startSimulation = async () => {
        const hasHistoricalData = selectedSymbols.some(symbol => 
            simulationData[symbol] && simulationData[symbol].length > 0
        );

        if (!hasHistoricalData) {
            await fetchAllHistoricalData();
        }

        const stillHasData = selectedSymbols.some(symbol => 
            simulationData[symbol] && simulationData[symbol].length > 0
        );

        if (stillHasData) {
            setCurrentSimIndex(0);
            setIsSimulating(true);
            setError(null);
        }
    };

    const stopSimulation = () => {
        setIsSimulating(false);
    };

    const canStartSimulation = selectedSymbols.some(symbol => 
        simulationData[symbol] && simulationData[symbol].length > 0
    );

    return (
        <>
            {selectedSymbols.map(symbol => (
                <PetDisplay
                    key={symbol}
                    mood={pets[symbol]?.mood || "neutral"}
                    isSimulating={isSimulating}
                    symbol={symbol}
                    data={pets[symbol]?.data}
                />
            ))}

            <div className="flex flex-col items-center p-6 space-y-4 relative z-10">
                {!isSimulating && (
                    <StockSelector 
                        selectedStocks={selectedSymbols}
                        onStocksChange={setSelectedSymbols}
                        isSimulating={isSimulating}
                    />
                )}
                <SimulationControls
                    isSimulating={isSimulating}
                    onStartSimulation={startSimulation}
                    onStopSimulation={stopSimulation}
                    simulationSpeed={simulationSpeed}
                    onSpeedChange={setSimulationSpeed}
                    currentSimIndex={currentSimIndex}
                    simulationDataLength={Math.max(...selectedSymbols.map(symbol => 
                        simulationData[symbol] ? simulationData[symbol].length : 0
                    ))}
                    simulationData={simulationData}
                    canStartSimulation={canStartSimulation && !isLoadingHistorical}
                />

                <div className="flex flex-wrap gap-6 w-full px-8 justify-center">
                    {selectedSymbols.map(symbol => (
                        <div key={`info-${symbol}`} className="bg-white/90 border border-gray-200 rounded-lg p-4 shadow-sm backdrop-blur-sm">
                            <div className="text-center space-y-3">
                                <h3 className="text-lg font-semibold text-gray-800">{symbol}</h3>
                                
                                <StockDataDisplay
                                    data={pets[symbol]?.data}
                                    error={error}
                                    symbol={symbol}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};