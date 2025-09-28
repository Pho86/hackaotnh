import React, { useState, useEffect } from "react";
import fakeStockApiService from "../services/fakeStockApi";
import PetDisplay from "./PetDisplay";
import StockSelector from "./StockSelector";
import StockGraph from "./StockGraph";
import Button from "./Button";

export default function PetManager() {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [pets, setPets] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState({});
  const [currentSimIndex, setCurrentSimIndex] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [error, setError] = useState(null);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(false);
  const [viewMode, setViewMode] = useState("individual");

  useEffect(() => {
    const initialPets = {};
    selectedSymbols.forEach((symbol) => {
      initialPets[symbol] = {
        data: null,
        mood: "neutral",
        historicalData: [],
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
      const { results, errors } =
        await fakeStockApiService.fetchMultipleSymbols(selectedSymbols);

      setPets((prevPets) => {
        const updatedPets = { ...prevPets };

        results.forEach((result) => {
          updatedPets[result.symbol] = {
            ...updatedPets[result.symbol],
            data: result,
            mood: updateMood(result.changePercent),
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

      const symbolsToFetch = selectedSymbols.filter(
        (symbol) =>
          !pets[symbol]?.historicalData ||
          pets[symbol].historicalData.length === 0
      );

      if (symbolsToFetch.length === 0) {
        setIsLoadingHistorical(false);
        return;
      }

      const { results, errors } =
        await fakeStockApiService.fetchMultipleHistoricalData(
          symbolsToFetch,
          150 // 150 days historical + 50 days predictions = 200 total
        );

      setSimulationData((prevData) => ({
        ...prevData,
        ...results,
      }));

      setPets((prevPets) => {
        const updatedPets = { ...prevPets };
        symbolsToFetch.forEach((symbol) => {
          if (results[symbol]) {
            updatedPets[symbol] = {
              ...updatedPets[symbol],
              historicalData: results[symbol],
            };
          }
        });
        return updatedPets;
      });

      if (Object.keys(errors).length > 0) {
        const errorSymbols = Object.keys(errors);
        setError(`Failed to fetch data for: ${errorSymbols.join(", ")}`);
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
      setCurrentSimIndex((prev) => {
        const allSymbolsHaveData = selectedSymbols.every(
          (symbol) =>
            simulationData[symbol] && simulationData[symbol].length > 0
        );

        if (!allSymbolsHaveData) return prev;

        const maxLength = Math.max(
          ...selectedSymbols.map((symbol) => simulationData[symbol].length)
        );
        const nextIndex = prev + 1;

        if (nextIndex >= maxLength) {
          setIsSimulating(false);
          return prev;
        }

        setPets((prevPets) => {
          const updatedPets = { ...prevPets };

          selectedSymbols.forEach((symbol) => {
            if (simulationData[symbol] && simulationData[symbol][nextIndex]) {
              const currentData = simulationData[symbol][nextIndex];
              const prevData = simulationData[symbol][prev] || currentData;

              const changePercent = prevData
                ? ((currentData.price - prevData.price) / prevData.price) * 100
                : 0;

              updatedPets[symbol] = {
                ...updatedPets[symbol],
                data: {
                  ...currentData,
                  changePercent,
                },
                mood: updateMood(changePercent),
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
    const hasHistoricalData = selectedSymbols.some(
      (symbol) => simulationData[symbol] && simulationData[symbol].length > 0
    );

    if (!hasHistoricalData) {
      await fetchAllHistoricalData();
    }

    const stillHasData = selectedSymbols.some(
      (symbol) => simulationData[symbol] && simulationData[symbol].length > 0
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

  const canStartSimulation = selectedSymbols.some(
    (symbol) => simulationData[symbol] && simulationData[symbol].length > 0
  );

  return (
    <>
      {selectedSymbols.map((symbol) => (
        <PetDisplay
          key={symbol}
          mood={pets[symbol]?.mood || "neutral"}
          isSimulating={isSimulating}
          symbol={symbol}
          data={pets[symbol]?.data}
        />
      ))}
      {/* Control Panel */}
        <div className="flex flex-col md:flex-row space-y-4 mb-4 p-4">
            <div className="flex flex-row space-x-4 items-center">
                
                <Button
                    onClick={isSimulating ? stopSimulation : startSimulation}
                    disabled={!isSimulating && (!canStartSimulation || isLoadingHistorical)}
                    variant={isSimulating ? "danger" : "success"}
                >
                      {isSimulating ? "Reset" : "Start"}
                </Button>

                <Button 
                    onClick={() => setViewMode(viewMode === 'individual' ? 'portfolio' : 'individual')}
                    variant="default"
                    className={"bg-[#2F454C] hover:bg-[#2F454C] "}
                    active={viewMode === 'portfolio'}
                    >
                    {viewMode === 'individual' ? 'Portfolio' : 'Individual'}
                </Button>
                
                <Button
                    onClick={() => {
                        if (simulationSpeed === 500) {
                            setSimulationSpeed(1000);
                        } else if (simulationSpeed === 1000) {
                            setSimulationSpeed(2000);
                        } else {
                            setSimulationSpeed(500);
                        }
                    }}
                    className={"bg-[#4c2f2f] "}
                    >
                    {simulationSpeed === 500 ? ">>>" : simulationSpeed === 1000 ? ">>" : ">"}
                </Button>
            </div>
            
            {!isSimulating && (
                <StockSelector
                    selectedStocks={selectedSymbols}
                    onStocksChange={setSelectedSymbols}
                    isSimulating={isSimulating}
                    onRemoveStock={(symbol) => setSelectedSymbols(prev => prev.filter(s => s !== symbol))}
                />
            )}
            
            {isSimulating && (
                <div className="text-sm text-white-600 px-4 flex justify-center flex-col">
                    <p>Day {currentSimIndex + 1} of {Math.max(...selectedSymbols.map((symbol) =>
                        simulationData[symbol] ? simulationData[symbol].length : 0
                    ))}</p>
                    {simulationData && Object.keys(simulationData).length > 0 && (
                        <p className="text-xs text-white/80">
                            Date: {Object.values(simulationData)[0]?.[currentSimIndex]?.date || 'Loading...'}
                        </p>
                    )}
                </div>
            )}
        </div>

      <div className="flex flex-col items-left p-6 space-y-4 relative z-10">

         <div className="flex flex-col p-6 space-y-4 relative z-10">
           <StockGraph
             stocks={pets}
             isSimulating={isSimulating}
             currentSimIndex={currentSimIndex}
             simulationData={simulationData}
             viewMode={viewMode}
           />
           
         </div>
      </div>
    </>
  );
}
