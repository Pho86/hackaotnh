import React from "react";
import Button from "./Button";

export default function SimulationControls({
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  simulationSpeed,
  onSpeedChange,
  currentSimIndex,
  simulationDataLength,
  simulationData,
  canStartSimulation = true,
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

      <div className="flex items-center space-x-2">
        <label className="text-sm">Speed:</label>
        <input
          type="range"
          min="200"
          max="3000"
          value={simulationSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-20"
          disabled={false}
        />
        <span className="text-sm">{simulationSpeed}ms</span>
      </div>

      {isSimulating && simulationDataLength > 0 && (
        <div className="text-sm text-gray-200">
          <p>
            Day {currentSimIndex + 1} of {simulationDataLength}
          </p>
          {simulationData && Object.keys(simulationData).length > 0 && (
            <p className="text-xs text-gray-500">
              Date:{" "}
              {Object.values(simulationData)[0]?.[currentSimIndex]?.date ||
                "Loading..."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
