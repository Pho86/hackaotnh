import React from "react";
import PetManager from "./PetManager";
import backgroundImg from "../assets/home.png";

export default function StockPet() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        minWidth: "100vw",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <PetManager />
    </div>
  );
}
