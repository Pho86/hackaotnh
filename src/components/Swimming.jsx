import React, { useEffect, useState } from "react";

export default function Swimming() {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const moveRandom = () => {
    const x = window.innerWidth - 100;
    const y = window.innerHeight - 100;
    const randomX = Math.random() * x;
    const randomY = Math.random() * y;
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
        transition: "all 2.5s linear",
        fontSize: "2rem",
      }}
    >
      🐟
    </div>
  );
}
