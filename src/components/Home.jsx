import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/home.png";
import goldfishImg from "../assets/grindset-goldfish.png";

export default function Home() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleStart = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/stockpet");
    }, 250);
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
          width: "300px",
          height: "300px",
          objectFit: "contain",
          marginTop: "32px",
          cursor: "pointer",
          opacity: fadeIn ? 1 : 0,
          transition:
            "opacity 1.2s ease, transform 0.25s cubic-bezier(.4,2,.6,1)",
          transform: clicked ? "scale(1.12)" : "scale(1)",
        }}
        onClick={handleStart}
      />
    </div>
  );
}
