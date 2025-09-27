import React, { useEffect, useState } from 'react';

export default function PetDisplay({ mood, isSimulating, symbol }) {
    const [position, setPosition] = useState({
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
    });

    const getPetEmoji = () => {
        switch (mood) {
            case "happy":
                return "🐟";
            case "sad":
                return "🐠";
            case "neutral":
            default:
                return "🐡";
        }
    };

    const moveRandom = () => {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        setPosition({ x, y });
    };

    useEffect(() => {
        if (isSimulating) {
            const interval = setInterval(moveRandom, 2000 + Math.random() * 1000); 
            return () => clearInterval(interval);
        }
    }, [isSimulating]);

    if (!isSimulating) return null;

    return (
        <div
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                transition: "all 2s ease-in-out",
                fontSize: "2rem",
                zIndex: 50,
                pointerEvents: "none",
            }}
        >
            <div className="relative">
                {getPetEmoji()}
                {/* Stock symbol label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded shadow-sm whitespace-nowrap">
                    {symbol}
                </div>
            </div>
        </div>
    );
};
