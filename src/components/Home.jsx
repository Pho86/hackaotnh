import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/home.png";
import goldfishImg from "../assets/grindset-goldfish.png";
export default function Home() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleStart = () => {
    navigate("/stockpet");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={goldfishImg}
        alt="Grindset Goldfish"
        style={{
          width: "500px",
          height: "500px",
          objectFit: "contain",
          marginTop: "32px",
          cursor: "pointer",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
        onClick={handleStart}
      />
    </div>
  );
}
