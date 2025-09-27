import React, { useEffect, useState } from "react";

export default function Swimming() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [flipFish, setFlipped] = useState(true);
  const [prevX, setPrevX] = useState(100);

  const moveRandom = () => {
    const x = window.innerWidth - 100;
    const y = window.innerHeight - 100;
    const randomX = Math.random() * x;
    const randomY = Math.random() * y;

    setFlipped(randomX >= prevX);
    setPrevX(randomX);
    setPosition({ x: randomX, y: randomY });
  };

  useEffect(() => {
    const interval = setInterval(moveRandom, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transition: "all 0.5 linear",
        transform: flipFish ? "rotateY(-1)" : "rotateY(1)",
      }}
    >
      🐟
    </div>
  );
}
