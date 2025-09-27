import React from "react";
import PetManager from "./PetManager";
import backgroundImg from "../assets/background.png";

export default function StockPet() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <PetManager symbols={[SYMBOL]} />
    </div>
  );
}
