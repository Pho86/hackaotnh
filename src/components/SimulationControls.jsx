import React from 'react';
import Button from './Button';

export default function SimulationControls({ 
    isSimulating, 
    onStartSimulation, 
    onStopSimulation, 
    simulationSpeed, 
    onSpeedChange,
    currentSimIndex,
    simulationDataLength,
    simulationData,
    canStartSimulation = true 
}) {
    return (
        <div className="flex flex-col items-center space-y-2 bg-zinc-150 p-4 rounded-lg">
            <h2 className="font-semibold">Grindset Goldfish</h2>
            
            <div className="flex space-x-2">
                <Button
                    onClick={onStartSimulation}
                    disabled={isSimulating || !canStartSimulation}
                    variant="success"
                >
                    {isSimulating ? "Simulating..." : "Start Life"}
                </Button>
                
                <Button
                    onClick={onStopSimulation}
                    disabled={!isSimulating}
                    variant="danger"
                >
                    Stop
                </Button>
            </div>

            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Speed:</label>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {simulationSpeed}ms
                    </span>
                </div>
                
                <div className="flex space-x-2">
                    <Button
                        onClick={() => onSpeedChange(500)}

                        active={simulationSpeed === 500}
                        className="px-3 h-8 text-xs"
                    >
                        Fast
                    </Button>
                    <Button
                        onClick={() => onSpeedChange(1000)}
                        active={simulationSpeed === 1000}
                        className="px-3 h-8 text-xs"
                    >
                        Normal
                    </Button>
                    <Button
                        onClick={() => onSpeedChange(2000)}
                        active={simulationSpeed === 2000}
                        className="h-8 px-3 py-1 text-xs"
                    >
                        Slow
                    </Button>
                </div>
                
                {/* Speed Slider */}
                <div className="flex items-center space-x-2 w-full max-w-xs">
                    <span className="text-xs text-gray-500">500ms</span>
                    <input
                        type="range"
                        min="500"
                        max="2000"
                        step="100"
                        value={simulationSpeed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                        className="flex-1"
                    />
                    <span className="text-xs text-gray-500">2000ms</span>
                </div>
            </div>

                {isSimulating && simulationDataLength > 0 && (
                    <div className="text-sm text-gray-600">
                        <p>Day {currentSimIndex + 1} of {simulationDataLength}</p>
                        {simulationData && Object.keys(simulationData).length > 0 && (
                            <p className="text-xs text-gray-500">
                                Date: {Object.values(simulationData)[0]?.[currentSimIndex]?.date || 'Loading...'}
                                {Object.values(simulationData)[0]?.[currentSimIndex]?.isPrediction && (
                                    <span className="ml-2 text-purple-600 font-medium">🔮 PREDICTION</span>
                                )}
                            </p>
                        )}
                    </div>
                )}
        </div>
    );
};
