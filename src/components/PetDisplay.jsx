import React, { useEffect, useState } from 'react';

export default function PetDisplay({ mood = "neutral", isSimulating = true, symbol = "TEST", data = { changePercent: 2.5 } }) {
    const [position, setPosition] = useState({
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    });
    const [direction, setDirection] = useState(1);
    const [rotation, setRotation] = useState(0);

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

    useEffect(() => {
        if (!isSimulating) return;

        const moveFish = () => {
            setPosition(prev => {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const horizontalMove = (Math.random() - 0.5) * 400; 
                let newX = prev.x + horizontalMove;

                newX = Math.max(100, Math.min(windowWidth - 100, newX));

                if (horizontalMove !== 0) {
                    const newDirection = horizontalMove > 0 ? 1 : -1;
                    setDirection(newDirection);
                    setRotation(newDirection === 1 ? 0 : 180);
                }

                let verticalMove = 0;
                if (data && typeof data.changePercent === 'number') {
                    verticalMove = (data.changePercent / 10) * 150;
                } else {
                    verticalMove = (Math.random() - 0.5) * 200;
                }

                let newY = prev.y + verticalMove;

                newY = Math.max(100, Math.min(windowHeight - 150, newY));

                return { x: newX, y: newY };
            });
        };

        moveFish();

        const interval = setInterval(moveFish, 2000);

        return () => clearInterval(interval);
    }, [isSimulating, data?.changePercent]); 
    
    useEffect(() => {
        const handleResize = () => {
            setPosition(prev => ({
                x: Math.max(100, Math.min(window.innerWidth - 100, prev.x)),
                y: Math.max(100, Math.min(window.innerHeight - 150, prev.y))
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isSimulating) return null;

    return (
        <div
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                transition: "all 1.8s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 50,
                pointerEvents: "none",
                willChange: "transform", 
            }}
        >
            <div className="relative">
                <div
                    style={{
                        fontSize: "2rem",
                        transform: `rotateY(${rotation}deg)`,
                        transformOrigin: "center",
                        transition: "transform 0.5s ease-in-out",
                        display: "inline-block", 
                    }}
                >
                    {getPetEmoji()}
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded shadow-sm whitespace-nowrap border">
                    {symbol} {data && typeof data.changePercent === 'number' ?
                        `(${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(1)}%)` :
                        '(No data)'
                    }
                </div>
            </div>
        </div>
    );
}