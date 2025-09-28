import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/bg-home.png";
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
    <>
      <div className="overflow-hidden h-screen w-screen absolute top-0 left-0 pointer-events-none">
        <div className="bubble one"></div>
        <div className="bubble two"></div>
        <div className="bubble three"></div>
        <div className="bubble four"></div>
        <div className="bubble five"></div>
        <div className="bubble six"></div>
        <div className="bubble seven"></div>
        <div className="bubble eight"></div>
        <div className="bubble nine"></div>
        <div className="bubble ten"></div>
      </div>
      <div
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
          height: "100dvh",
          width: "100dvw",
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
    </>
  );
}
