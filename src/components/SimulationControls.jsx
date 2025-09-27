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
}) {
    return (
        <div className="flex flex-col items-center space-y-2 bg-zinc-150 p-4 rounded-lg">
            <div className="flex space-x-2">
                <div className="flex space-x-2">
                    <Button
                        onClick={isSimulating ? onStopSimulation : onStartSimulation}
                        variant={isSimulating ? "danger" : "success"}
                    >
                        {isSimulating ? "Stop Life" : "Start Life"}
                    </Button >

                </div >

                <div className="flex flex-col items-center space-y-2">
                    <Button
                        onClick={() => {
                            if (simulationSpeed === 500) {
                                onSpeedChange(1000);
                            } else if (simulationSpeed === 1000) {
                                onSpeedChange(2000);
                            } else {
                                onSpeedChange(500);
                            }
                        }}
                    >
                        {simulationSpeed === 500 ? ">" : simulationSpeed === 1000 ? ">>" : ">>>"}
                    </Button>
                </div>
                {isSimulating && simulationDataLength > 0 && (
                    <div className="text-sm text-white">
                        <p>Day {currentSimIndex + 1} of {simulationDataLength}</p>
                        {simulationData && Object.keys(simulationData).length > 0 && (
                            <p className="text-xs text-white/60">
                                Date: {Object.values(simulationData)[0]?.[currentSimIndex]?.date || 'Loading...'}
                                {Object.values(simulationData)[0]?.[currentSimIndex]?.isPrediction && (
                                    <span className="ml-2 text-purple-600 font-medium">🔮 PREDICTION</span>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>
            </div>
            );
};